CREATE TABLE "employees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" text NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employees_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "employees_username_unique" UNIQUE("username"),
	CONSTRAINT "employees_email_unique" UNIQUE("email")
);
