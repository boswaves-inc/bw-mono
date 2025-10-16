CREATE TABLE "user_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "user_info_email_unique" UNIQUE("email")
);
