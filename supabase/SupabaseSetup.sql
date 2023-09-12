CREATE TABLE "public"."new_transactions" (
    "transaction_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid" NOT NULL,
    "input" "text" NOT NULL,
    "errored" "text",
    "code" "text" DEFAULT '[]'::"text",
    "feedback" "text",
    "usage" numeric DEFAULT '0'::numeric,
    "questions" "text",
    "deleted" boolean DEFAULT false,
    "history" "text",
    "synced" boolean DEFAULT false
);


ALTER TABLE "public"."new_transactions" OWNER TO "postgres";

CREATE TABLE "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "first_name" "text",
    "avatar_url" "text",
    "user_name" "text",
    "full_name" "text",
    "email" "text",
    "primary_repo" "uuid",
    "local_fe_port" "text",
    "local_repo_dir" "text",
    "technologies_used" "text",
    "theme" "text" DEFAULT 'Normal'::"text",
    "files_to_ignore" "text" DEFAULT '.jpg,.png,.svg,.jpeg,.gif,.pdf,.env,.lock,node_modules,package-lock.json,yarn.lock,build,dist,out,.git,.svn,.hg,.bzr,.vscode,.idea,.DS_Store,npm-debug.log,yarn-error.log,bin,obj,venv,.venv,.pyc,pkg,vendor,.android,build.gradle,local.properties,.tmp,.log,.bak,.ipynb_checkpoints,.ipynb,.o,.build,.swiftpm,.kotlin_built'::"text",
    "context" "text"
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE TABLE "public"."users" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "token_id" "uuid" DEFAULT "extensions"."uuid_generate_v4"(),
    "github_valid" boolean DEFAULT false NOT NULL,
    "token_valid" boolean DEFAULT false NOT NULL,
    "email" "text",
    "isEnterprise" boolean,
    "git_provider" "text" DEFAULT 'github'::"text",
    "team_members" "text"
);


ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE ONLY "public"."new_transactions"
    ADD CONSTRAINT "new_transactions_pkey" PRIMARY KEY ("transaction_id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "prod_users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "prod_users_token_id_key" UNIQUE ("token_id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "prod_users_user_id_key" UNIQUE ("user_id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

CREATE POLICY "Allow users to SELECT Tasks" ON "public"."new_transactions" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."new_transactions" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."new_transactions" FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."users" FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for users" ON "public"."new_transactions" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "User can UPDATE Profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "Users can UPDATE information" ON "public"."users" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Users can view their Row" ON "public"."profiles" TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "Users can view their Row" ON "public"."users" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

ALTER TABLE "public"."new_transactions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION public.create_new_user() 
returns trigger as $$
begin
  insert into public.users(user_id)
  values(new.id);
  return new;
end;
$$ language plpgsql security definer;
create trigger new_profile_created
  after insert on public.profiles
  for each row execute procedure public.create_new_user();



create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();