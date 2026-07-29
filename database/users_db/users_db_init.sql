--
-- PostgreSQL database dump
--

\restrict xBuIy8fFcrzib0vMpb4CoZXAW2t6FGTmyIVu1h9RXVMh8ZZrRvvyyVXNzG7e2kf

-- Dumped from database version 18.4 (Ubuntu 18.4-1.pgdg25.10+1)
-- Dumped by pg_dump version 18.4 (Ubuntu 18.4-1.pgdg25.10+1)

-- Started on 2026-07-27 17:10:55 CEST

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
-- TOC entry 870 (class 1247 OID 17216)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'user',
    'admin'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16841)
-- Name: settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    theme character varying DEFAULT 'dark'::character varying NOT NULL,
    starter integer DEFAULT 0 NOT NULL,
    "userId" integer,
    avatar character varying(30) DEFAULT 'ghost02'::character varying
);


ALTER TABLE public.settings OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16840)
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.settings_id_seq OWNER TO postgres;

--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 219
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- TOC entry 225 (class 1259 OID 16998)
-- Name: typeorm_metadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.typeorm_metadata (
    type character varying NOT NULL,
    database character varying,
    schema character varying,
    "table" character varying,
    name character varying,
    value text
);


ALTER TABLE public.typeorm_metadata OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16857)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    "fortyTwoId" integer NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL,
    "avatarUrl" character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
    "coalitionId" integer DEFAULT 0,
    "coalitionName" character varying
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16856)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO postgres;

--
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 221
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 224 (class 1259 OID 16880)
-- Name: user_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_stats (
    id integer NOT NULL,
    total_damage_given integer DEFAULT 0 NOT NULL,
    total_damage_received integer DEFAULT 0 NOT NULL,
    nb_victories integer DEFAULT 0 NOT NULL,
    nb_defeats integer DEFAULT 0 NOT NULL,
    nb_monsters_discovered integer DEFAULT 0 NOT NULL,
    nb_objects_discovered integer DEFAULT 0 NOT NULL,
    nb_achievements integer DEFAULT 0 NOT NULL,
    "userId" integer,
    nb_fights integer GENERATED ALWAYS AS ((nb_victories + nb_defeats)) STORED NOT NULL
);


ALTER TABLE public.user_stats OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16879)
-- Name: user_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_stats_id_seq OWNER TO postgres;

--
-- TOC entry 3532 (class 0 OID 0)
-- Dependencies: 223
-- Name: user_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_stats_id_seq OWNED BY public.user_stats.id;


--
-- TOC entry 3340 (class 2604 OID 16844)
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- TOC entry 3344 (class 2604 OID 16860)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 3348 (class 2604 OID 16883)
-- Name: user_stats id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_stats ALTER COLUMN id SET DEFAULT nextval('public.user_stats_id_seq'::regclass);


--
-- TOC entry 3519 (class 0 OID 16841)
-- Dependencies: 220
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.settings (id, theme, starter, "userId", avatar) FROM stdin;
\.


--
-- TOC entry 3524 (class 0 OID 16998)
-- Dependencies: 225
-- Data for Name: typeorm_metadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.typeorm_metadata (type, database, schema, "table", name, value) FROM stdin;
GENERATED_COLUMN	test	public	user_stats	nb_fights	"nb_victories" + "nb_defeats"
\.


--
-- TOC entry 3521 (class 0 OID 16857)
-- Dependencies: 222
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, "fortyTwoId", username, email, "avatarUrl", created_at, role, "coalitionId", "coalitionName") FROM stdin;
\.


--
-- TOC entry 3523 (class 0 OID 16880)
-- Dependencies: 224
-- Data for Name: user_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_stats (id, total_damage_given, total_damage_received, nb_victories, nb_defeats, nb_monsters_discovered, nb_objects_discovered, nb_achievements, "userId") FROM stdin;
\.


--
-- TOC entry 3533 (class 0 OID 0)
-- Dependencies: 219
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.settings_id_seq', 7, true);


--
-- TOC entry 3534 (class 0 OID 0)
-- Dependencies: 221
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 7, true);


--
-- TOC entry 3535 (class 0 OID 0)
-- Dependencies: 223
-- Name: user_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_stats_id_seq', 6, true);


--
-- TOC entry 3358 (class 2606 OID 16853)
-- Name: settings PK_0669fe20e252eb692bf4d344975; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY (id);


--
-- TOC entry 3362 (class 2606 OID 16871)
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- TOC entry 3366 (class 2606 OID 16900)
-- Name: user_stats PK_f55fb5b508e96b05303efae93e5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_stats
    ADD CONSTRAINT "PK_f55fb5b508e96b05303efae93e5" PRIMARY KEY (id);


--
-- TOC entry 3368 (class 2606 OID 16902)
-- Name: user_stats REL_1ef59671d5359ff63ae55ae4ef; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_stats
    ADD CONSTRAINT "REL_1ef59671d5359ff63ae55ae4ef" UNIQUE ("userId");


--
-- TOC entry 3360 (class 2606 OID 16855)
-- Name: settings REL_9175e059b0a720536f7726a88c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT "REL_9175e059b0a720536f7726a88c" UNIQUE ("userId");


--
-- TOC entry 3364 (class 2606 OID 16873)
-- Name: user UQ_e798808c3c0d30c91ea9bd6b80c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e798808c3c0d30c91ea9bd6b80c" UNIQUE ("fortyTwoId");


--
-- TOC entry 3370 (class 2606 OID 16903)
-- Name: user_stats FK_1ef59671d5359ff63ae55ae4efa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_stats
    ADD CONSTRAINT "FK_1ef59671d5359ff63ae55ae4efa" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- TOC entry 3369 (class 2606 OID 17011)
-- Name: settings FK_9175e059b0a720536f7726a88c7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT "FK_9175e059b0a720536f7726a88c7" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


-- Completed on 2026-07-27 17:10:55 CEST

--
-- PostgreSQL database dump complete
--

\unrestrict xBuIy8fFcrzib0vMpb4CoZXAW2t6FGTmyIVu1h9RXVMh8ZZrRvvyyVXNzG7e2kf

