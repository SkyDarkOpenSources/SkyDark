ALTER TABLE "employees" DROP CONSTRAINT "employees_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "username" text NOT NULL;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_username_unique" UNIQUE("username");--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_email_unique" UNIQUE("email");