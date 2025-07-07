ALTER TABLE "employees" DROP CONSTRAINT "employees_username_unique";--> statement-breakpoint
ALTER TABLE "employees" DROP CONSTRAINT "employees_email_unique";--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN "username";--> statement-breakpoint
ALTER TABLE "employees" DROP COLUMN "email";