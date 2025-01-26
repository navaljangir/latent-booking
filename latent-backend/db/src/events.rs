use crate::Db;
use log::info;
use serde::{Deserialize, Serialize};
use sqlx::Error;
use sqlx::types::time::PrimitiveDateTime;
use uuid::Uuid;


#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Event {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub image_url: String,
}
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SeatType {
    pub name: String,
    pub description: String, 
    pub price: f64, 
    pub capacity: u32    
}


impl Db {
    pub async fn create_event(
        &self,
        name: String,
        description: String,
        banner: String,
        admin_id: Uuid,
        location_id: Uuid,
        start_time: PrimitiveDateTime,
        seats: SeatType,
    ) -> Result<Event, Error> {
        let event_id = Uuid::new_v4();
        
        let mut tx = self.client.begin().await?;

        // Insert event
        let event = sqlx::query_as::<_, Event>(
            r#"
            INSERT INTO events (
                id, 
                name, 
                description, 
                banner, 
                admin_id, 
                location_id, 
                start_time,
                processed,
                published,
                ended,
                timeout_in_s
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, 0, false, false, 600)
            RETURNING id, name, description, banner as image_url, start_time
            "#
        )
        .bind(event_id)
        .bind(name)
        .bind(description)
        .bind(banner)
        .bind(admin_id)
        .bind(location_id)
        .bind(start_time)
        .fetch_one(&mut *tx)
        .await?;

        // Insert seat type
        sqlx::query(
            r#"
            INSERT INTO seat_types (
                id,
                name, 
                description, 
                event_id, 
                price, 
                capacity
            ) VALUES ($1, $2, $3, $4, $5, $6)
            "#
        )
        .bind(Uuid::new_v4())
        .bind(seats.name)
        .bind(seats.description)
        .bind(event_id)
        .bind((seats.price * 100.0) as i32) 
        .bind(seats.capacity as i32)
        .execute(&mut *tx)
        .await?;

        // Commit transaction
        tx.commit().await?;

        info!("Event created successfully with id: {:?}", event);
        Ok(event)
    }

    pub async fn get_events(
        &self,
        admin_id: Uuid,
    ) -> Result<Vec<Event>, Error> {
        info!("Finding the events for admin {:}", admin_id);
        
        let events = sqlx::query_as::<_, Event>("SELECT * FROM events WHERE admin_id = $1")
            .bind(admin_id)
            .fetch_all(&self.client) 
            .await?;
    
        info!("Events found: {:?}", events);
        Ok(events)
    }
}