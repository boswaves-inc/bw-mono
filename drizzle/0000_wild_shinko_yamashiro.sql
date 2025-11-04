CREATE TYPE "public"."status" AS ENUM('archived', 'public');--> statement-breakpoint
CREATE TYPE "public"."user_provider" AS ENUM('internal', 'google');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "item_info" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"status" "status" DEFAULT 'archived' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "item_info_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "item_script" (
	"id" uuid PRIMARY KEY NOT NULL,
	"script" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "item_script_script_unique" UNIQUE("script")
);
--> statement-breakpoint
CREATE TABLE "user_info" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"cbid" text NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"email" "citext" NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"provider" "user_provider" DEFAULT 'internal' NOT NULL,
	"provider_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_info_email_unique" UNIQUE("email"),
	CONSTRAINT "user_info_provider_id_unique" UNIQUE("provider_id")
);
--> statement-breakpoint
CREATE TABLE "user_credentials" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"password" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "item_script" ADD CONSTRAINT "item_script_id_item_info_id_fk" FOREIGN KEY ("id") REFERENCES "public"."item_info"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_uid_user_info_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."user_info"("uid") ON DELETE no action ON UPDATE no action;