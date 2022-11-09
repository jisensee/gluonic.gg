--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Debian 14.5-1.pgdg110+1)
-- Dumped by pg_dump version 14.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ProjectAuthorRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProjectAuthorRole" AS ENUM (
    'ADMIN',
    'AUTHOR'
);


ALTER TYPE public."ProjectAuthorRole" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Game; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Game" (
    id text NOT NULL,
    key text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    "logoUrl" text NOT NULL,
    website text NOT NULL,
    "socialsId" text NOT NULL
);


ALTER TABLE public."Game" OWNER TO postgres;

--
-- Name: Project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Project" (
    id text NOT NULL,
    key text NOT NULL,
    name text NOT NULL,
    abstract text NOT NULL,
    description text,
    "donationAddress" text,
    "logoUrl" text,
    website text NOT NULL,
    "gameId" text NOT NULL,
    "socialsId" text NOT NULL,
    published boolean DEFAULT false NOT NULL,
    "lastUpdate" timestamp(3) without time zone
);


ALTER TABLE public."Project" OWNER TO postgres;

--
-- Name: ProjectAuthorships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProjectAuthorships" (
    type public."ProjectAuthorRole" NOT NULL,
    "userId" text NOT NULL,
    "projectId" text NOT NULL
);


ALTER TABLE public."ProjectAuthorships" OWNER TO postgres;

--
-- Name: ProjectPost; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProjectPost" (
    id text NOT NULL,
    "authorId" text NOT NULL,
    "projectId" text NOT NULL,
    abstract text NOT NULL,
    body text NOT NULL,
    "editedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "publishedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title text NOT NULL
);


ALTER TABLE public."ProjectPost" OWNER TO postgres;

--
-- Name: ProjectRequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProjectRequest" (
    id text NOT NULL,
    "projectName" text NOT NULL,
    "projectAbstract" text NOT NULL,
    "projectWebsite" text NOT NULL,
    "requestedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    rejected boolean DEFAULT false NOT NULL,
    "userId" text NOT NULL,
    "gameId" text NOT NULL
);


ALTER TABLE public."ProjectRequest" OWNER TO postgres;

--
-- Name: Socials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Socials" (
    id text NOT NULL,
    website text,
    twitter text,
    github text,
    discord text
);


ALTER TABLE public."Socials" OWNER TO postgres;

--
-- Name: Tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tag" (
    id text NOT NULL,
    key text NOT NULL,
    name text NOT NULL,
    "gameId" text
);


ALTER TABLE public."Tag" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    address text NOT NULL,
    name text,
    bio text,
    "joinedAt" timestamp(3) without time zone NOT NULL,
    role public."UserRole" DEFAULT 'USER'::public."UserRole" NOT NULL,
    "socialsId" text NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _ProjectToTag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_ProjectToTag" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ProjectToTag" OWNER TO postgres;

--
-- Name: _ProjectToUser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_ProjectToUser" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ProjectToUser" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Game; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Game" (id, key, name, description, "logoUrl", website, "socialsId") FROM stdin;
7ecee81b-a6cc-433a-931e-d7e193a24f6a	influence	Influence	Influence is an open-economy, space strategy MMO in which players own all of their content. Colonize asteroids, build infrastructure, discover technologies, engage in combat. Expand your influence across the belt.	/influence.svg	https://influenceth.io	75e6edb0-2742-444a-951a-1c0bdab20398
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Project" (id, key, name, abstract, description, "donationAddress", "logoUrl", website, "gameId", "socialsId", published, "lastUpdate") FROM stdin;
81293485-4c92-4869-ae5a-02334c87a593	adalia.info	adalia.info	adalia.info is the best place to get an overview over all asteroids in the game. You can filter and sort asteroids over all their properties and even see some basic stats on your selection.	adalia.info lets you browse through all asteroids in the game in a handy table.  \n__Notable features include:__\n- Tabular asteroid overview with configurable columns\n- Very fine sorting and filtering options\n- Export of the current selection as CSV and JSON\n- Stats about total owned/scanned asteroids, total owned surface area, spectral type and rarities	0xA3C7a2943D26782dC271d0D36B99f7459b981eE8	https://gluonic.eu-central-1.linodeobjects.com/project-logo-adalia.info-b8eb2b04-6e0b-4675-91f5-ef1060e1118d	https://adalia.info	7ecee81b-a6cc-433a-931e-d7e193a24f6a	959b4653-044c-41c5-91dd-7bda0aeadb3e	t	2022-10-02 22:29:35.977
6a0b5f29-24d2-45fc-b52a-e5837b3020a4	daharius-influence-tools	Daharius's Influence Tools	Various tools for looking up info for Asteroids, Building Crews and more!	Lookup info on currently minted asteroids\nhttps://influence.daharius.com/AsteroidLookup/\n\nView info on your asteroids\nhttps://influence.daharius.com/MyAsteroids\n\nLookup any Crew Card\nhttps://influence.daharius.com/CrewLookup\n\nLookup all of your Crew Cards\nhttps://influence.daharius.com/MyCrew\n\nPlan your Crew Teams\nhttps://influence.daharius.com/CrewPlanner\n\nView and sort all of the Products in Adalia\nhttps://influence.daharius.com/ProductList	0x2cE497038A94B54eA1C7193A7D7693804372813B	https://gluonic.eu-central-1.linodeobjects.com/project-logo-daharius-influence-tools-94f77357-a415-4e5a-8143-dd4538ebcb77	https://influence.daharius.com/AsteroidLookup/	7ecee81b-a6cc-433a-931e-d7e193a24f6a	7555ddf2-1c6a-4f4a-9b10-12f43a08efc3	t	2022-10-26 19:02:46.081
939024c7-b8a5-4dfd-9de4-7b394e62e991	adalia-co-orbital-rocks	Adalia Co-orbital Rocks	Adalia Co-orbital Rocks for Influence MMO game Build your network of spectral resources around your favorite owned asteroid. Automatically find friendly harmonic asteroid orbits in addition to co-orbital asteroids.	![logo with text](https://i.ibb.co/9TSnsCz/acr-project-logo.png)\n*Harmonic asteroid orbit finder (v1) for Influence MMO game.*\n![demo](https://i.ibb.co/kJB5GR8/acr-4.gif)\n\n\n### Build your network\nFind asteroids with various spectral resources around your favorite owned asteroid. Automatically find friendly harmonic asteroid orbits in addition to co-orbital asteroids.\n\nLooking to sell a few asteroids? Put together some co-orbital asteroids that you can bundle together as a "Ready-Made-Network" and sell on a marketplace like Opensea.\n\n### Export Top 100 Filtered results\nExport a CSV file of the top 100 asteroids based on your filter selection. Share with your alliance or guild members to build your interstellar empire.\n\nPlanning to sell an asteroid that has some great co-orbitals? Share your generated  CSV co-orbital asteroid list with your buyers to show its network potential.\n\n	0x2884Ce188EfD73B7F18a5B9a24A259eA447f585f	https://gluonic.eu-central-1.linodeobjects.com/project-logo-adalia-co-orbital-rocks-0c00fb4c-5e65-4c72-ad84-78d1478d1fb9	https://adalia.coorbital.rocks/	7ecee81b-a6cc-433a-931e-d7e193a24f6a	4665958b-28a2-42b2-be40-2c9b40ead4bf	t	2022-10-27 12:45:06.802
1ef56460-ff4e-442d-9427-6189f2ec6200	influence-sales	Influence Sales	A dashboard to explore and analyze the secondary market for Influence NFTs using key indicators and interactive charts.\nAccess beta via Discord.	## ***StarkSight*** - formerly known as *Influence Sales*\nThe main objective of *StarkSight* is to give tools to explore and analyze the secondary market for Influence NFTs specifically, by providing insightful figures and interactive data visuals about the assets'\n* Fundamental characteristics\n* Trading history\n* Current listings for sale\n\nAble to compare assets features and prices together, buyers and sellers can make better-informed trading decisions, leading to a healthier market.  \nUsers also have the opportunity to analyze the assets of any wallet address (including their own, connecting through Metamask).   \n\nIn summary, *StarkSight* allows you to see what would be good deals *for you*.  \n\n\n### *Data* - The Discord bot\n`Data` is the companion of the StarkSight website and provides data on demand and OpenSea alerts on Influence's discord server.  	\N	https://gluonic.eu-central-1.linodeobjects.com/project-logo-influence-sales-aeac6c90-4e0f-41f1-aa2c-741a9e9aad90	https://starksight.xyz	7ecee81b-a6cc-433a-931e-d7e193a24f6a	f6e7cdf5-cecd-4a38-9eb2-c39fac1c9819	t	2022-12-17 09:59:17.346
976e6ed6-3290-4d60-96ad-b7b3c68057d2	adalia.guide	Adalia.Guide	Your Guide to the Adalia System.	A little library of Adalian resources. Primarily collects material from The Coastin Cartographic Society and the Allen Mining Company, among other things.	\N	https://gluonic.eu-central-1.linodeobjects.com/project-logo-adalia.guide-56581250-53d9-44da-b05f-efa75e1678d4	https://adalia.guide/	7ecee81b-a6cc-433a-931e-d7e193a24f6a	6bf1c25c-f074-4f20-888a-12da77fe0300	t	2022-10-16 01:24:25.455
9012a280-529a-4588-8ec2-91a4533ee4b7	asteroids-planner	Asteroids Planner	The Asteroids Planner allows players, or alliances, to plan their production chains across multiple asteroids.	The Asteroids Planner allows players, or alliances, to plan their production chains across multiple asteroids:\n- Add in-game asteroids, or create "mock rocks"\n- Plan one or more production chains, on each asteroid\n- Connect your wallet, to automatically save your plan	0xdf610269c6587c579e76b03fba17ee51dd02b0c8	https://gluonic.eu-central-1.linodeobjects.com/project-logo-asteroids-planner-6ae41b2c-5a94-4701-946a-36aeae9d5182	https://materials.adalia.id/asteroids-planner.html	7ecee81b-a6cc-433a-931e-d7e193a24f6a	9ae8555b-4b4d-4a72-96a2-04468f19d675	t	2022-10-23 21:39:52.112
a1197be4-04f1-4d62-9c2e-4394ac762d1b	tyrell-yutani-industrial-hub	Tyrell-Yutani Industrial Hub	Influence Crew and Asteroid ranking with supporting analysis of features and their relationship to the game mechanics.	# Tyrell-Yutani Industries\n### A Corporate & Industrial Logistics HUB for the blockchain game INFLUENCE. \nOur goal is to provide tools and services to explore, compare, manage, and maximise the potential of player-owned assets.\n### Crew Services\n- Crew rarity/ratings (Owned & Global)\n- Department breakdown\n- Crew assignment interactive map\n- Crew avatar download\n### Asteroid Services\n- Asteroid rarity/ratings (Owned & Global)\n- Sunburst Adalia explorer\n- Spectral type element comparisons\n### System map \nAn interactive map of the 800 largest asteroids within Adalia.\n* Source & Target asteroid selection.\n* Switchable exaggerated relative radius.\n* Time speed and navigation.\n* Coastin Cartographic Society overlays.\n* Scalable view with asteroid location following.\n* Overlays with Names, ID's, and element footprints.\n* Distance over time profile for a range of time spans.\n\nThe bottom section shows the distance over time for the selected asteroids. Ranging from now until an adjustable time in the future. Compare weeks, months, and years to explore the rhythm of Adalia.\n### Blockchain Services\n- Browse and filter all blockchain events\n### Support\nSupport via discord link in Associate Lounge.	0x7965B64a62699e4E4ed2A5eecb5348911D7cAA1a	https://gluonic.eu-central-1.linodeobjects.com/project-logo-tyrell-yutani-industrial-hub-b5fab764-7e25-445e-9ff8-a8df08549ff0	https://tyrell-yutani.app/	7ecee81b-a6cc-433a-931e-d7e193a24f6a	5d185fdc-d46a-4d70-9946-c004822c6483	t	2022-10-24 11:20:52.984
62cd2a52-0339-4656-ab9f-ae8908900322	mdeb-influence-lore	MDeB Influence Lore	The online portfolio for Influence Lore by Matthew A DeBarth. 	A list of all published Influence Lore written by Matthew A DeBarth (AKA Korivak), in recommended reading order.	\N	https://gluonic.eu-central-1.linodeobjects.com/project-logo-mdeb-influence-lore-317102d6-50e5-4daa-9e00-53276a21fabc	https://matthew.debarth.com/influence	7ecee81b-a6cc-433a-931e-d7e193a24f6a	53c25df5-f4e6-4547-85ac-b4c193ac75aa	t	2022-10-25 13:38:29.641
9e7124d4-6b11-49d5-a7b0-116f2d29815c	last-night-in-space	Last Night in Space	Adalia's Daily News Source.	An in-universe news periodical, regularly updated with reports of player actions.	\N	https://gluonic.eu-central-1.linodeobjects.com/project-logo-last-night-in-space-97f931a5-fc69-438c-873f-fa2bfe7e2201	https://lastnight.space	7ecee81b-a6cc-433a-931e-d7e193a24f6a	784560a6-e9d0-4862-9830-b904a0f0e3bf	t	2022-12-04 04:40:27.054
3a93bb18-6832-42a2-ab12-dac013e38c3a	strwrsfrk-influence-lore	strwrsfrk Influence Lore	Prodigious Alignment, Part 1: A young girl's adventures expose her to a dark part of the Arvad's history. Meanwhile, her father struggles to balance the demands of his new role against the time spent with his daughter.\n\nOversaturated: A down-on-his-luck Engineer finds a crew against all odds.		\N	\N	https://strwrsfrk.medium.com/	7ecee81b-a6cc-433a-931e-d7e193a24f6a	a31c8e51-b395-4df0-a346-6b36d866231f	t	2022-10-26 13:56:46.556
\.


--
-- Data for Name: ProjectAuthorships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProjectAuthorships" (type, "userId", "projectId") FROM stdin;
ADMIN	badb33ec-0211-459e-9214-5663278cfe87	9012a280-529a-4588-8ec2-91a4533ee4b7
ADMIN	badb33ec-0211-459e-9214-5663278cfe87	81293485-4c92-4869-ae5a-02334c87a593
ADMIN	badb33ec-0211-459e-9214-5663278cfe87	a1197be4-04f1-4d62-9c2e-4394ac762d1b
ADMIN	badb33ec-0211-459e-9214-5663278cfe87	62cd2a52-0339-4656-ab9f-ae8908900322
ADMIN	badb33ec-0211-459e-9214-5663278cfe87	976e6ed6-3290-4d60-96ad-b7b3c68057d2
ADMIN	badb33ec-0211-459e-9214-5663278cfe87	9e7124d4-6b11-49d5-a7b0-116f2d29815c
ADMIN	badb33ec-0211-459e-9214-5663278cfe87	1ef56460-ff4e-442d-9427-6189f2ec6200
ADMIN	badb33ec-0211-459e-9214-5663278cfe87	3a93bb18-6832-42a2-ab12-dac013e38c3a
ADMIN	badb33ec-0211-459e-9214-5663278cfe87	6a0b5f29-24d2-45fc-b52a-e5837b3020a4
ADMIN	badb33ec-0211-459e-9214-5663278cfe87	939024c7-b8a5-4dfd-9de4-7b394e62e991
\.


--
-- Data for Name: ProjectPost; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProjectPost" (id, "authorId", "projectId", abstract, body, "editedAt", "publishedAt", title) FROM stdin;
ab54051b-69a0-4b73-9b8e-7d9a24c30f88	badb33ec-0211-459e-9214-5663278cfe87	1ef56460-ff4e-442d-9427-6189f2ec6200	hello	content	2022-12-21 14:47:51.131	2022-12-21 14:47:51.131	This is a second post
a5fb8127-abf7-4900-8375-9caab94ddfbc	badb33ec-0211-459e-9214-5663278cfe87	1ef56460-ff4e-442d-9427-6189f2ec6200	abstract	contet	2022-12-21 14:54:59.336	2022-12-21 14:54:59.336	new post
\.


--
-- Data for Name: ProjectRequest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProjectRequest" (id, "projectName", "projectAbstract", "projectWebsite", "requestedAt", rejected, "userId", "gameId") FROM stdin;
\.


--
-- Data for Name: Socials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Socials" (id, website, twitter, github, discord) FROM stdin;
75e6edb0-2742-444a-951a-1c0bdab20398	\N	https://twitter.com/influenceth	https://github.com/influenceth	https://discord.gg/UHMqbznhJS
ff764035-3a56-490b-bd76-4fba7249a018	\N	\N	\N	\N
959b4653-044c-41c5-91dd-7bda0aeadb3e	\N		https://github.com/jisensee/adalia.info	https://discord.gg/XynYK5yCQy
7503a0a9-0ecd-4771-8e23-82430b7acea9	\N	\N	\N	\N
ebaff702-4e58-4c36-9b85-e441a2eb06be	https://adalia.coorbital.rocks/	https://twitter.com/RGR_Metaverse		
b9f2f81e-3a49-4ab1-a4a1-dd51e81d3632	https://tyrell-yutani.app/	@tyrell_yutani		https://discord.gg/2Qnew8ePBa
c48f59c0-a92e-4abd-8310-a11f02f72e19	\N	\N	\N	\N
2534ce4c-5f5c-4d80-9f71-1b6464e591f9	\N	\N	\N	\N
ba067e0b-b371-47d7-8aed-884b18309b5f	https://adalia.guide/	@KorivakETH		Korivak#0930
6bf1c25c-f074-4f20-888a-12da77fe0300	\N	\N	\N	\N
f6e7cdf5-cecd-4a38-9eb2-c39fac1c9819	\N	https://twitter.com/_Teandy		https://discord.gg/mAkkPZftnH
9ae8555b-4b4d-4a72-96a2-04468f19d675	\N	elerium115	Elerium-115/influence-materials-and-production	Elerium115#8299
a642a586-0cec-42ff-b78f-7e181576c4a8	https://teandy.be	@trevis_dev	trevis-dev	trevis#7067
b600f8d0-d467-4ddf-b4f3-5cfc91a73d58	https://materials.adalia.id/	elerium115	https://github.com/Elerium-115/	Elerium115#8299
5d185fdc-d46a-4d70-9946-c004822c6483	\N	@tyrell_yutani		https://discord.gg/2Qnew8ePBa
53c25df5-f4e6-4547-85ac-b4c193ac75aa	\N	@KorivakETH		https://discord.gg/AbvfsfC87w
a31c8e51-b395-4df0-a346-6b36d866231f	\N	\N	\N	\N
6c7714a3-115a-4537-9547-80403641e9d4		@strwrsfrk		@strwrsfrk#1308
7555ddf2-1c6a-4f4a-9b10-12f43a08efc3	\N	Dahari		Daharius#9285
c8bc8b69-c747-45ac-accd-6f8d2175a420	https://influence.daharius.com/AsteroidLookup/	Dahari		Daharius#9285
c14437a7-73eb-44f4-b182-04dde53b8c4f	\N	\N	\N	\N
4665958b-28a2-42b2-be40-2c9b40ead4bf	\N	https://twitter.com/RGR_Metaverse/		RGR#4875
91ac4a0a-e3eb-4343-9bba-61d026e09e85	\N	\N	\N	\N
f7faf8a9-a0d6-42cf-8c28-c7238dd378a2	\N	\N	\N	\N
6f5f5d5a-8765-4ee6-ae10-5b8f39e27542	\N	\N	\N	\N
4d42213d-786d-4bcf-ac59-f992f24b2a7b	\N	\N	\N	\N
5f31b0e4-f9a7-43c6-944f-e3a8c6cf7e5f	\N	\N	\N	\N
d59f7183-9a00-4664-916a-899f931b8b73		@0xdenker	https://github.com/jisensee	Denker#2417
784560a6-e9d0-4862-9830-b904a0f0e3bf	\N	\N	\N	\N
64aefa39-ce96-4688-8085-e2f3629d84d7	\N	@0xdenker	jisensee	Denker#2417
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tag" (id, key, name, "gameId") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, address, name, bio, "joinedAt", role, "socialsId") FROM stdin;
badb33ec-0211-459e-9214-5663278cfe87	0x4e3971cD6Dee316734cd647450285C80EC25F59b	TestAdmin		2022-12-21 14:39:53.896	ADMIN	64aefa39-ce96-4688-8085-e2f3629d84d7
\.


--
-- Data for Name: _ProjectToTag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_ProjectToTag" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _ProjectToUser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_ProjectToUser" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
3b92b905-5af6-427d-a793-d89cc0cb1af5	9eae470f53fad241d8677f41974d47db5fe09a41916b286b4558e8e46f8910df	2022-10-02 19:54:20.072539+00	20221002194824_initial	\N	\N	2022-10-02 19:54:19.577473+00	1
bbd25757-6597-447f-aed1-fee4efd53c89	0c21376b7e909ed9847ce220e756be6bdf12557acf9a13fb4b0de0ca398236d9	2022-10-05 21:04:34.031457+00	20221005205316_project_requests	\N	\N	2022-10-05 21:04:33.532949+00	1
835f5a9b-5ea8-497e-912a-1545f58a1641	8ecbc7fd9fb798884f60a34aec4f53934dba72e99047c0fe1ee45d82cae2e231	2022-10-09 15:41:48.594531+00	20221008125454_project_favorites	\N	\N	2022-10-09 15:41:48.113518+00	1
31cad3aa-5995-4519-be50-8bdf107af3b0	437e079c3b151fc5d24245a7116630b4abaaffb763aab0b75cd8312ee0088d54	2022-12-21 14:38:25.226736+00	20221221143825_posts	\N	\N	2022-12-21 14:38:25.221122+00	1
\.


--
-- Name: Game Game_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Game"
    ADD CONSTRAINT "Game_pkey" PRIMARY KEY (id);


--
-- Name: ProjectAuthorships ProjectAuthorships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectAuthorships"
    ADD CONSTRAINT "ProjectAuthorships_pkey" PRIMARY KEY ("userId", "projectId");


--
-- Name: ProjectPost ProjectPost_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectPost"
    ADD CONSTRAINT "ProjectPost_pkey" PRIMARY KEY (id);


--
-- Name: ProjectRequest ProjectRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectRequest"
    ADD CONSTRAINT "ProjectRequest_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: Socials Socials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Socials"
    ADD CONSTRAINT "Socials_pkey" PRIMARY KEY (id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Game_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Game_key_key" ON public."Game" USING btree (key);


--
-- Name: Project_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Project_key_key" ON public."Project" USING btree (key);


--
-- Name: Tag_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Tag_key_key" ON public."Tag" USING btree (key);


--
-- Name: User_address_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_address_key" ON public."User" USING btree (address);


--
-- Name: _ProjectToTag_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_ProjectToTag_AB_unique" ON public."_ProjectToTag" USING btree ("A", "B");


--
-- Name: _ProjectToTag_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_ProjectToTag_B_index" ON public."_ProjectToTag" USING btree ("B");


--
-- Name: _ProjectToUser_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_ProjectToUser_AB_unique" ON public."_ProjectToUser" USING btree ("A", "B");


--
-- Name: _ProjectToUser_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_ProjectToUser_B_index" ON public."_ProjectToUser" USING btree ("B");


--
-- Name: Game Game_socialsId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Game"
    ADD CONSTRAINT "Game_socialsId_fkey" FOREIGN KEY ("socialsId") REFERENCES public."Socials"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProjectAuthorships ProjectAuthorships_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectAuthorships"
    ADD CONSTRAINT "ProjectAuthorships_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProjectAuthorships ProjectAuthorships_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectAuthorships"
    ADD CONSTRAINT "ProjectAuthorships_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProjectPost ProjectPost_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectPost"
    ADD CONSTRAINT "ProjectPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProjectPost ProjectPost_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectPost"
    ADD CONSTRAINT "ProjectPost_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProjectRequest ProjectRequest_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectRequest"
    ADD CONSTRAINT "ProjectRequest_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public."Game"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProjectRequest ProjectRequest_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectRequest"
    ADD CONSTRAINT "ProjectRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Project Project_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public."Game"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Project Project_socialsId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_socialsId_fkey" FOREIGN KEY ("socialsId") REFERENCES public."Socials"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Tag Tag_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public."Game"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_socialsId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_socialsId_fkey" FOREIGN KEY ("socialsId") REFERENCES public."Socials"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _ProjectToTag _ProjectToTag_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProjectToTag"
    ADD CONSTRAINT "_ProjectToTag_A_fkey" FOREIGN KEY ("A") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProjectToTag _ProjectToTag_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProjectToTag"
    ADD CONSTRAINT "_ProjectToTag_B_fkey" FOREIGN KEY ("B") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProjectToUser _ProjectToUser_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProjectToUser"
    ADD CONSTRAINT "_ProjectToUser_A_fkey" FOREIGN KEY ("A") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProjectToUser _ProjectToUser_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProjectToUser"
    ADD CONSTRAINT "_ProjectToUser_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

