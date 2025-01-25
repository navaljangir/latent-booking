// use poem::web::{Data, Json};
// use poem_openapi::{OpenApi, Object, payload};
// use crate::{error::AppError, AppState, utils::{totp, twilio}};
// use serde::{Deserialize, Serialize};

// #[derive(Debug, Serialize, Deserialize, Object)]
// pub struct CreateSuperAdmin {
//     pub number: String,
// }

// #[derive(Debug, Deserialize, Serialize, Object)]
// pub struct CreateSuperAdminResponse {
//     pub message: String,
//     pub id: String,
// }

// #[derive(Debug, Serialize, Deserialize, Object)]
// pub struct CreateAdminVerify {
//     number: String,
//     totp: String,
//     name: String,
// }

// #[derive(Debug, Deserialize, Serialize, Object)]
// pub struct VerifyAdminResponse {
//     token: String,
// }

// pub struct  AdminApi; 

// #[OpenApi]
// impl AdminApi {
//     /// Create a super admin
//     #[oai(path = "/signin", method = "post")]
//     pub async fn signin_admin(
//         &self, 
//         body: Json<CreateSuperAdmin>, 
//         state: Data<&AppState>
//     ) -> poem::Result<payload::Json<CreateSuperAdminResponse>, AppError> {
//         let number = body.0.number;
//         let super_admin = state.db.create_admin(number.clone()).await?;

//         // Generate and send OTP
//         let otp = totp::get_token(&number, "SUPERADMIN");
//         if cfg!(not(debug_assertions)) {
//             twilio::send_message(&format!("Your OTP for signing up to Latent is {}", otp), &number)
//                 .await
//                 .map_err(|_| AppError::InternalServerError(payload::Json(crate::error::ErrorBody {
//                     message: "Failed to send OTP".to_string(),
//                 })))?;
//         } else {
//             println!("Development mode: OTP is {}", otp);
//         }



//         Ok(payload::Json(CreateSuperAdminResponse {
//             message: "Super Admin created successfully".to_string(),
//             id: super_admin.id.to_string()
//         }))
//     }

//     /// Verify admin creation
//     #[oai(path = "/verify", method = "post")]
//     pub async fn create_admin_verify(
//         &self, 
//         body: Json<crate::routes::admin::CreateAdminVerify>,
//         state: Data<&AppState>
//     ) -> poem::Result<payload::Json<crate::routes::admin::VerifyAdminResponse>, AppError> {
//         let crate::routes::admin::CreateAdminVerify { number, totp: otp, name } = body.0;
        
//         // Verify OTP
//         if cfg!(not(debug_assertions)) {
//             if !totp::verify_token(&number, "AUTH", &otp) {
//                 return Err(AppError::InvalidCredentials(payload::Json(crate::error::ErrorBody {
//                     message: "Invalid OTP".to_string(),
//                 })));
//             }
//         }

//         let token = state.db.verify_admin(number, name).await?;
        
//         Ok(payload::Json(crate::routes::admin::VerifyAdminResponse { token }))
//     }
// }