--
-- PostgreSQL database dump
--

\restrict PPBg6n138lnsNPXDtcVoFxvnosieNNSxR3vETur60OgSCaarkPeUAi5PLE8Di1w

-- Dumped from database version 18.4 (Ubuntu 18.4-1.pgdg25.10+1)
-- Dumped by pg_dump version 18.4 (Ubuntu 18.4-1.pgdg25.10+1)

-- Started on 2026-07-02 12:09:13 CEST

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
-- TOC entry 886 (class 1247 OID 17229)
-- Name: monster_rarity; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.monster_rarity AS ENUM (
    'legendary',
    'common',
    'uncommon',
    'rare',
    'not_foundable'
);


ALTER TYPE public.monster_rarity OWNER TO postgres;

--
-- TOC entry 895 (class 1247 OID 17076)
-- Name: monster_stat_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.monster_stat_enum AS ENUM (
    'attack',
    'attack_spe',
    'defense',
    'defense_spe',
    'speed'
);


ALTER TYPE public.monster_stat_enum OWNER TO postgres;

--
-- TOC entry 880 (class 1247 OID 17174)
-- Name: monster_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.monster_type_enum AS ENUM (
    'neutral',
    'fire',
    'water',
    'earth',
    'plant',
    'fly'
);


ALTER TYPE public.monster_type_enum OWNER TO postgres;

--
-- TOC entry 874 (class 1247 OID 17109)
-- Name: object_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.object_type_enum AS ENUM (
    'heal',
    'damage',
    'capture',
    'stat_up',
    'stat_down'
);


ALTER TYPE public.object_type_enum OWNER TO postgres;

--
-- TOC entry 871 (class 1247 OID 17041)
-- Name: skill_effect_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.skill_effect_enum AS ENUM (
    'damage',
    'dodge',
    'up_stat',
    'down_stat'
);


ALTER TYPE public.skill_effect_enum OWNER TO postgres;

--
-- TOC entry 868 (class 1247 OID 17055)
-- Name: skill_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.skill_type_enum AS ENUM (
    'neutral',
    'fly',
    'water',
    'plant',
    'earth',
    'fire',
    'psy',
    'dark',
    'light',
    'none'
);


ALTER TYPE public.skill_type_enum OWNER TO postgres;

--
-- TOC entry 892 (class 1247 OID 17248)
-- Name: tile_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tile_type AS ENUM (
    'grass',
    'water',
    'tree'
);


ALTER TYPE public.tile_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 17143)
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    id integer CONSTRAINT items_id_not_null NOT NULL,
    name character varying(30) CONSTRAINT items_name_not_null NOT NULL,
    type public.object_type_enum CONSTRAINT items_type_not_null NOT NULL,
    value integer CONSTRAINT items_value_not_null NOT NULL,
    target public.monster_stat_enum
);


ALTER TABLE public.items OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17142)
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.items ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 17241)
-- Name: maps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maps (
    id integer NOT NULL,
    name character varying(30) NOT NULL
);


ALTER TABLE public.maps OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 17240)
-- Name: maps_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.maps ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.maps_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 230 (class 1259 OID 17263)
-- Name: maps_tiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maps_tiles (
    map_id integer NOT NULL,
    tile_id integer NOT NULL
);


ALTER TABLE public.maps_tiles OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 17018)
-- Name: monsters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.monsters (
    id integer CONSTRAINT monster_id_not_null NOT NULL,
    name character varying(30) CONSTRAINT monster_name_not_null NOT NULL,
    hp_total integer CONSTRAINT monster_hp_total_not_null NOT NULL,
    attack integer CONSTRAINT monster_attack_not_null NOT NULL,
    attack_spe integer CONSTRAINT monster_attack_spe_not_null NOT NULL,
    defense integer CONSTRAINT monster_defense_not_null NOT NULL,
    defense_spe integer CONSTRAINT monster_defense_spe_not_null NOT NULL,
    speed integer CONSTRAINT monster_speed_not_null NOT NULL,
    type public.monster_type_enum NOT NULL,
    rarity public.monster_rarity NOT NULL
);


ALTER TABLE public.monsters OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17017)
-- Name: monster_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.monsters ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.monster_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 226 (class 1259 OID 17190)
-- Name: monsters_skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.monsters_skills (
    monster_id integer NOT NULL,
    skill_id integer NOT NULL
);


ALTER TABLE public.monsters_skills OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17189)
-- Name: monsters_skills_monster_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.monsters_skills ALTER COLUMN monster_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.monsters_skills_monster_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 17154)
-- Name: skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skills (
    id integer NOT NULL,
    name character varying(30) NOT NULL,
    power_point integer NOT NULL,
    effect public.skill_effect_enum NOT NULL,
    type public.skill_type_enum NOT NULL,
    value real DEFAULT 0.0 NOT NULL,
    repetition integer DEFAULT 1 NOT NULL,
    "precision" integer DEFAULT 100 NOT NULL,
    data public.monster_stat_enum
);


ALTER TABLE public.skills OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 17172)
-- Name: skills_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.skills ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.skills_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 229 (class 1259 OID 17255)
-- Name: tiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tiles (
    id integer CONSTRAINT "Tiles_id_not_null" NOT NULL,
    type public.tile_type CONSTRAINT "Tiles_type_not_null" NOT NULL
);


ALTER TABLE public.tiles OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 17270)
-- Name: tiles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tiles ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tiles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 232 (class 1259 OID 17273)
-- Name: tiles_monsters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tiles_monsters (
    tile_id integer NOT NULL,
    monster_id integer NOT NULL
);


ALTER TABLE public.tiles_monsters OWNER TO postgres;

--
-- TOC entry 3556 (class 0 OID 17143)
-- Dependencies: 222
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (id, name, type, value, target) FROM stdin;
1	potion	heal	50	\N
2	bomb	damage	50	\N
3	lucky clover	capture	100	\N
4	rage	stat_up	20	attack
\.


--
-- TOC entry 3562 (class 0 OID 17241)
-- Dependencies: 228
-- Data for Name: maps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maps (id, name) FROM stdin;
1	first_map
\.


--
-- TOC entry 3564 (class 0 OID 17263)
-- Dependencies: 230
-- Data for Name: maps_tiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maps_tiles (map_id, tile_id) FROM stdin;
1	2
1	3
1	1
\.


--
-- TOC entry 3554 (class 0 OID 17018)
-- Dependencies: 220
-- Data for Name: monsters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.monsters (id, name, hp_total, attack, attack_spe, defense, defense_spe, speed, type, rarity) FROM stdin;
1	Pisciner	50	10	10	5	5	50	neutral	not_foundable
2	Fishet	120	10	15	5	15	100	water	common
3	Burpy	100	20	30	0	20	80	water	uncommon
4	Sharky	150	20	30	0	20	150	water	rare
5	Squirrel	100	20	20	5	10	110	neutral	common
6	Papate	180	10	15	5	10	80	earth	uncommon
7	Gigantomakia	200	20	30	15	25	50	earth	rare
9	Monkel	130	15	15	10	20	100	neutral	uncommon
10	Pigeonne	120	25	25	10	10	160	fly	rare
8	Leaves	80	35	45	0	10	100	plant	common
\.


--
-- TOC entry 3560 (class 0 OID 17190)
-- Dependencies: 226
-- Data for Name: monsters_skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.monsters_skills (monster_id, skill_id) FROM stdin;
1	1
1	4
2	17
2	7
2	8
3	2
3	4
3	8
4	4
4	7
4	8
4	9
5	2
5	4
5	19
6	12
6	18
6	3
7	12
7	4
7	16
7	6
8	10
8	3
8	11
9	3
9	12
9	5
10	13
10	3
10	14
10	15
\.


--
-- TOC entry 3557 (class 0 OID 17154)
-- Dependencies: 223
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skills (id, name, power_point, effect, type, value, repetition, "precision", data) FROM stdin;
1	think	100	damage	neutral	0	1	100	\N
2	claw	10	damage	neutral	1.2	1	100	\N
3	slap	10	damage	neutral	1.5	1	100	\N
4	bite	10	damage	neutral	2	1	90	\N
5	multi-punch	5	damage	neutral	1	4	75	\N
6	ultralaser	1	damage	neutral	4	1	75	\N
7	splash	15	damage	water	1	1	100	\N
8	bubulle	5	damage	water	1.5	3	75	\N
9	tsunami	1	damage	water	4	1	75	\N
10	tranche	10	damage	plant	1.5	1	100	\N
11	whip-vine	5	damage	plant	2.5	1	100	\N
12	rock	5	damage	earth	1.5	1	100	\N
13	pic	10	damage	fly	1.5	1	100	\N
14	tornade	3	damage	fly	2.5	4	70	\N
15	dodge	3	dodge	none	0	1	100	\N
16	armor	3	up_stat	none	5	1	100	\N
17	swimming	3	up_stat	none	10	1	100	speed
18	grow	3	up_stat	none	5	1	100	attack
19	kawai	3	down_stat	none	5	1	100	attack_spe
\.


--
-- TOC entry 3563 (class 0 OID 17255)
-- Dependencies: 229
-- Data for Name: tiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tiles (id, type) FROM stdin;
1	tree
2	water
3	grass
\.


--
-- TOC entry 3566 (class 0 OID 17273)
-- Dependencies: 232
-- Data for Name: tiles_monsters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tiles_monsters (tile_id, monster_id) FROM stdin;
3	10
3	9
3	8
2	4
2	3
2	2
1	7
1	6
1	5
\.


--
-- TOC entry 3572 (class 0 OID 0)
-- Dependencies: 221
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_id_seq', 4, true);


--
-- TOC entry 3573 (class 0 OID 0)
-- Dependencies: 227
-- Name: maps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.maps_id_seq', 1, true);


--
-- TOC entry 3574 (class 0 OID 0)
-- Dependencies: 219
-- Name: monster_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.monster_id_seq', 10, true);


--
-- TOC entry 3575 (class 0 OID 0)
-- Dependencies: 225
-- Name: monsters_skills_monster_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.monsters_skills_monster_id_seq', 1, false);


--
-- TOC entry 3576 (class 0 OID 0)
-- Dependencies: 224
-- Name: skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skills_id_seq', 19, true);


--
-- TOC entry 3577 (class 0 OID 0)
-- Dependencies: 231
-- Name: tiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tiles_id_seq', 3, true);


--
-- TOC entry 3389 (class 2606 OID 17171)
-- Name: skills Skill_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT "Skill_name_key" UNIQUE (name);


--
-- TOC entry 3385 (class 2606 OID 17153)
-- Name: items item_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT item_name_key UNIQUE (name);


--
-- TOC entry 3387 (class 2606 OID 17151)
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- TOC entry 3395 (class 2606 OID 17246)
-- Name: maps maps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maps
    ADD CONSTRAINT maps_pkey PRIMARY KEY (id);


--
-- TOC entry 3399 (class 2606 OID 17269)
-- Name: maps_tiles maps_tiles_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maps_tiles
    ADD CONSTRAINT maps_tiles_pk PRIMARY KEY (map_id, tile_id);


--
-- TOC entry 3381 (class 2606 OID 17032)
-- Name: monsters monster_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monsters
    ADD CONSTRAINT monster_name_key UNIQUE (name);


--
-- TOC entry 3383 (class 2606 OID 17030)
-- Name: monsters monster_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monsters
    ADD CONSTRAINT monster_pkey PRIMARY KEY (id);


--
-- TOC entry 3393 (class 2606 OID 17196)
-- Name: monsters_skills monster_skills_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monsters_skills
    ADD CONSTRAINT monster_skills_pk PRIMARY KEY (monster_id, skill_id);


--
-- TOC entry 3391 (class 2606 OID 17169)
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- TOC entry 3401 (class 2606 OID 17279)
-- Name: tiles_monsters tile_monster_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiles_monsters
    ADD CONSTRAINT tile_monster_pk PRIMARY KEY (monster_id, tile_id);


--
-- TOC entry 3397 (class 2606 OID 17272)
-- Name: tiles tiles_id_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiles
    ADD CONSTRAINT tiles_id_pk PRIMARY KEY (id);


--
-- TOC entry 3402 (class 2606 OID 17197)
-- Name: monsters_skills fk_monster; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monsters_skills
    ADD CONSTRAINT fk_monster FOREIGN KEY (monster_id) REFERENCES public.monsters(id) NOT VALID;


--
-- TOC entry 3403 (class 2606 OID 17202)
-- Name: monsters_skills fk_skill; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monsters_skills
    ADD CONSTRAINT fk_skill FOREIGN KEY (skill_id) REFERENCES public.skills(id) NOT VALID;


--
-- TOC entry 3404 (class 2606 OID 17285)
-- Name: tiles_monsters monster_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiles_monsters
    ADD CONSTRAINT monster_id FOREIGN KEY (monster_id) REFERENCES public.monsters(id);


--
-- TOC entry 3405 (class 2606 OID 17280)
-- Name: tiles_monsters tile_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiles_monsters
    ADD CONSTRAINT tile_id FOREIGN KEY (tile_id) REFERENCES public.tiles(id);


-- Completed on 2026-07-02 12:09:13 CEST

--
-- PostgreSQL database dump complete
--

\unrestrict PPBg6n138lnsNPXDtcVoFxvnosieNNSxR3vETur60OgSCaarkPeUAi5PLE8Di1w

