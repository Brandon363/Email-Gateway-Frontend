export enum EntityStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED"
}

export enum PolicyType {
  AUTO = "AUTO",
  HOME = "HOME",
  LIFE = "LIFE",
  HEALTH = "HEALTH"
}

export enum PolicyStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED"
}

export enum ClaimStatus {
  SUBMITTED = "SUBMITTED",
  IN_REVIEW = "IN_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED"
}

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  MOBILE_MONEY = "MOBILE_MONEY"
}

export enum UserRole {
  ADMIN = "ADMIN",
  AGENT = "AGENT",
  CUSTOMER = "CUSTOMER"
}

export enum NotificationType {
  PAYMENT_UPDATE = "PAYMENT_UPDATE",
  CLAIM_UPDATE = "CLAIM_UPDATE",
  POLICY_UPDATE = "POLICY_UPDATE",
  ANNOUNCEMENT = "ANNOUNCEMENT",
  USER_UPDATE = "USER_UPDATE"
}

export enum NotificationStatus {
  UNREAD = "UNREAD",
  READ = "READ",
  ARCHIVED = "ARCHIVED"
}

export enum DocumentType {
  CLAIM_DOCUMENT = "CLAIM_DOCUMENT",
  SUPPORTING_DOCUMENT = "SUPPORTING_DOCUMENT",
  NATIONAL_ID = "NATIONAL_ID"
}

export enum VerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  UNVERIFIED = "UNVERIFIED",
  REJECTED = "REJECTED"
}

export enum ApplicationStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  DECLINED = "Declined",
  IN_PROGRESS = "In Progress"
}

export enum TrackingStatus {
  CURRENT = "Current",
  COMPLETED = "Completed",
  PENDING = "Pending",
}

export enum ApplicationStage {
  SUBMITTED = "Submitted",
  DOCUMENTS_VERIFIED = "Documents Verified",
  UNDER_REVIEW = "Under Review",
  APPROVED = "Approved",
  DECLINED = "Declined",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  OCR_DATA_VERIFIED = "OCR data verified"
}

export enum VerificationTrackingStage {
  SUBMITTED = "Submitted",
  RESUBMITTED = "Resubmitted",
  DOCUMENTS_VERIFIED = "Documents Verified",
  UNDER_REVIEW = "Under Review",
  APPROVED = "Approved",
  DECLINED = "Declined",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}


export enum ModelProvider {
  OPENAI = "openai",
  GOOGLE = "google"
}
export enum ChatModes {
  AGENT = "agent mode",
  CHAT = "chat mode",

}