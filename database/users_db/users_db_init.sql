--
-- PostgreSQL database dump
--

\restrict 4PqQ6dHDUHnBjVg3s1SGYQ4NKhgqkYisaTFBOjbk5yRRhpu3SMstjzvQn2wiKuH

-- Dumped from database version 18.4 (Ubuntu 18.4-1.pgdg25.10+1)
-- Dumped by pg_dump version 18.4 (Ubuntu 18.4-1.pgdg25.10+1)

-- Started on 2026-08-04 12:05:47 CEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 867 (class 1247 OID 17422)
-- Name: relationship_status_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.relationship_status_type AS ENUM (
    'accepted',
    'pending',
    'blocked'
);


ALTER TYPE public.relationship_status_type OWNER TO postgres;

--
-- TOC entry 864 (class 1247 OID 17413)
-- Name: user_role_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role_type AS ENUM (
    'user',
    'admin',
    'beta-tester'
);


ALTER TYPE public.user_role_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 17357)
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    provider character varying(50) NOT NULL,
    provider_account_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 17432)
-- Name: relationships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.relationships (
    requester_id uuid NOT NULL,
    accepter_id uuid NOT NULL,
    status public.relationship_status_type DEFAULT 'pending'::public.relationship_status_type NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at time with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.relationships OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17337)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    username character varying(50) DEFAULT NULL::character varying,
    password_hash character varying(255),
    is_onboarded boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    avatar_url text,
    coalition_id integer DEFAULT 0,
    settings jsonb DEFAULT '{"theme": "dark", "avatar": "dinoGreen", "starter": "pisciner"}'::jsonb NOT NULL,
    user_roles public.user_role_type[] DEFAULT ARRAY['user'::public.user_role_type] NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17381)
-- Name: users_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_stats (
    user_id uuid CONSTRAINT users_stat_user_id_not_null NOT NULL,
    games_played integer DEFAULT 0 CONSTRAINT users_stat_games_played_not_null NOT NULL,
    games_won integer DEFAULT 0 CONSTRAINT users_stat_games_won_not_null NOT NULL,
    games_lost integer DEFAULT 0 CONSTRAINT users_stat_games_lost_not_null NOT NULL,
    total_player_defeated integer DEFAULT 0 CONSTRAINT users_stat_total_player_defeated_not_null NOT NULL,
    nb_monsters_discovered integer DEFAULT 0 CONSTRAINT users_stat_nb_monsters_discovered_not_null NOT NULL,
    nb_ending_discovered integer DEFAULT 0 CONSTRAINT users_stat_nb_ending_discovered_not_null NOT NULL,
    nb_achievements integer DEFAULT 0 CONSTRAINT users_stat_nb_achievements_not_null NOT NULL,
    created_at timestamp with time zone DEFAULT now() CONSTRAINT users_stat_created_at_not_null NOT NULL,
    updated_at time with time zone DEFAULT now() CONSTRAINT users_stat_updated_at_not_null NOT NULL
);


ALTER TABLE public.users_stats OWNER TO postgres;

--
-- TOC entry 3525 (class 0 OID 17357)
-- Dependencies: 220
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts (id, user_id, provider, provider_account_id, created_at) FROM stdin;
\.


--
-- TOC entry 3527 (class 0 OID 17432)
-- Dependencies: 222
-- Data for Name: relationships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.relationships (requester_id, accepter_id, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3524 (class 0 OID 17337)
-- Dependencies: 219
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, username, password_hash, is_onboarded, created_at, updated_at, avatar_url, coalition_id, settings, user_roles) FROM stdin;
\.


--
-- TOC entry 3526 (class 0 OID 17381)
-- Dependencies: 221
-- Data for Name: users_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_stats (user_id, games_played, games_won, games_lost, total_damage_dealt, total_damage_received, nb_monsters_discovered, nb_objects_discovered, nb_achievements, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3370 (class 2606 OID 17368)
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- TOC entry 3374 (class 2606 OID 17444)
-- Name: relationships pk_user_relationships; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relationships
    ADD CONSTRAINT pk_user_relationships PRIMARY KEY (requester_id, accepter_id);


--
-- TOC entry 3364 (class 2606 OID 17356)
-- Name: users uq_username_users; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uq_username_users UNIQUE (username);


--
-- TOC entry 3366 (class 2606 OID 17354)
-- Name: users uq_users_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uq_users_email UNIQUE (email);


--
-- TOC entry 3368 (class 2606 OID 17352)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3372 (class 2606 OID 17406)
-- Name: users_stats users_stat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_stats
    ADD CONSTRAINT users_stat_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3375 (class 2606 OID 17376)
-- Name: accounts fk_accounts_users_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT fk_accounts_users_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3376 (class 2606 OID 17407)
-- Name: users_stats fk_users_stats_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_stats
    ADD CONSTRAINT fk_users_stats_users FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-08-04 12:05:47 CEST

--
-- PostgreSQL database dump complete
--

\unrestrict 4PqQ6dHDUHnBjVg3s1SGYQ4NKhgqkYisaTFBOjbk5yRRhpu3SMstjzvQn2wiKuH

