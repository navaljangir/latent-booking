use poem::web::{Data, Json};
use poem_openapi::{OpenApi, Object, payload};
use crate::{error::AppError, AppState};
use serde::{Deserialize, Serialize};
use time::format_description;
use time::PrimitiveDateTime;
use uuid::Uuid;
use db::events::SeatType;


#[derive(Debug, Serialize, Deserialize)]
pub struct CreateEventRequest {
    pub name: String,
    pub description: String,
    pub start_time: String,
    pub location_id: String,
    pub admin_id: String,
    pub banner: String,
    pub seats: SeatType,
}


#[derive(Debug, Deserialize, Serialize, Object)]
pub struct CreateEventResponse {
    pub message: String,
    pub id: String,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct GetEventRequest {
    pub admin_id: String
}
#[derive(Debug, Deserialize, Serialize, Object)]
pub struct GetEventResponse {
    pub message: String,
    pub events: String,
}


pub struct EventApi; 

#[OpenApi]
impl EventApi {
    #[oai(path = "/create", method = "post")]
    pub async fn create_event(
        &self, 
        body: Json<CreateEventRequest>, 
        state: Data<&AppState>,
    ) -> poem::Result<payload::Json<CreateEventResponse>, AppError> {
        // Parse UUIDs
        let location_id = Uuid::parse_str(&body.location_id)
            .map_err(|_| AppError::InvalidCredentials(payload::Json(crate::error::ErrorBody {
                message: "Invalid Location ID".to_string(),
            })))?;
    
        let admin_id = Uuid::parse_str(&body.admin_id)
            .map_err(|_| AppError::InvalidCredentials(payload::Json(crate::error::ErrorBody {
                message: "Invalid Admin ID".to_string(),
            })))?;

        // Parse start time
        let format = format_description::parse("[year]-[month]-[day] [hour]:[minute]:[second]")
            .map_err(|_| AppError::InternalServerError(payload::Json(crate::error::ErrorBody {
                message: "Invalid date format".to_string(),
            })))?;

        let start_time = PrimitiveDateTime::parse(&body.start_time, &format)
            .map_err(|_| AppError::InvalidCredentials(payload::Json(crate::error::ErrorBody {
                message: "Invalid start time".to_string(),
            })))?;

        // Create event
        let event = state
            .db
            .create_event(
                body.name.clone(),
                body.description.clone(),
                body.banner.clone(),
                admin_id,
                location_id,
                start_time,
                body.seats.clone(),
            )
            .await?;
        
        Ok(payload::Json(CreateEventResponse {
            message: "Event created successfully".to_string(),
            id: event.id.to_string(),
        }))
    }

    #[oai(path = "/", method = "get")]
    pub async fn get_events(
        &self, 
        body: Json<GetEventRequest>, 
        state: Data<&AppState>,
    ) -> poem::Result<payload::Json<GetEventResponse>, AppError> {
    
        let admin_id = Uuid::parse_str(&body.admin_id)
            .map_err(|_| AppError::InvalidCredentials(payload::Json(crate::error::ErrorBody {
                message: "Invalid Admin ID".to_string(),
            })))?;

        // Get event
        let events = state
            .db
            .get_events(
                admin_id
            )
            .await?;
        
        Ok(payload::Json(GetEventResponse {
            message: "Event created successfully".to_string(),
            events: events[0].name.to_string(),
        }))
    }
}