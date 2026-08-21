/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/game-service/src/app.controller.ts"
/*!*************************************************!*\
  !*** ./apps/game-service/src/app.controller.ts ***!
  \*************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./apps/game-service/src/app.service.ts");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ },

/***/ "./apps/game-service/src/app.module.ts"
/*!*********************************************!*\
  !*** ./apps/game-service/src/app.module.ts ***!
  \*********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const event_emitter_1 = __webpack_require__(/*! @nestjs/event-emitter */ "@nestjs/event-emitter");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const app_controller_1 = __webpack_require__(/*! ./app.controller */ "./apps/game-service/src/app.controller.ts");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./apps/game-service/src/app.service.ts");
const lobby_module_1 = __webpack_require__(/*! ./lobby/lobby.module */ "./apps/game-service/src/lobby/lobby.module.ts");
const game_module_1 = __webpack_require__(/*! ./game/game.module */ "./apps/game-service/src/game/game.module.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const schedule_1 = __webpack_require__(/*! @nestjs/schedule */ "@nestjs/schedule");
const secret_utils_1 = __webpack_require__(/*! libs/shared/src/utils/secret.utils */ "./libs/shared/src/utils/secret.utils.ts");
const redis_module_1 = __webpack_require__(/*! ./redis/redis.module */ "./apps/game-service/src/redis/redis.module.ts");
const redis_service_1 = __webpack_require__(/*! ./redis/redis.service */ "./apps/game-service/src/redis/redis.service.ts");
const lobby_controller_1 = __webpack_require__(/*! ./lobby/lobby.controller */ "./apps/game-service/src/lobby/lobby.controller.ts");
const health_module_1 = __webpack_require__(/*! libs/shared/src/health/health.module */ "./libs/shared/src/health/health.module.ts");
const shared_auth_module_1 = __webpack_require__(/*! libs/shared/src/auth/shared-auth.module */ "./libs/shared/src/auth/shared-auth.module.ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_GAME_HOST') ?? 'localhost',
                    port: configService.get('DB_GAME_PORT') ?? 5432,
                    username: (0, secret_utils_1.getSecret)('db_game_username'),
                    password: (0, secret_utils_1.getSecret)('db_game_password'),
                    database: (0, secret_utils_1.getSecret)('db_game_db_name'),
                    synchronize: false,
                    autoLoadEntities: true,
                }),
            }),
            lobby_module_1.LobbyModule,
            game_module_1.GameModule,
            event_emitter_1.EventEmitterModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
            health_module_1.HealthModule,
            redis_module_1.RedisModule,
            shared_auth_module_1.SharedJwtModule,
        ],
        controllers: [app_controller_1.AppController, lobby_controller_1.LobbyController],
        providers: [app_service_1.AppService, redis_service_1.RedisService],
    })
], AppModule);


/***/ },

/***/ "./apps/game-service/src/app.service.ts"
/*!**********************************************!*\
  !*** ./apps/game-service/src/app.service.ts ***!
  \**********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ },

/***/ "./apps/game-service/src/game/ai_service/ai.module.ts"
/*!************************************************************!*\
  !*** ./apps/game-service/src/game/ai_service/ai.module.ts ***!
  \************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const ai_service_1 = __webpack_require__(/*! ./ai.service */ "./apps/game-service/src/game/ai_service/ai.service.ts");
const ai_orchestrator_service_1 = __webpack_require__(/*! ./ai.orchestrator.service */ "./apps/game-service/src/game/ai_service/ai.orchestrator.service.ts");
const player_module_1 = __webpack_require__(/*! ../player/player.module */ "./apps/game-service/src/game/player/player.module.ts");
let AiModule = class AiModule {
};
exports.AiModule = AiModule;
exports.AiModule = AiModule = __decorate([
    (0, common_1.Module)({
        imports: [player_module_1.PlayerModule],
        providers: [ai_service_1.AiService, ai_orchestrator_service_1.AiOrchestratorService],
        exports: [ai_service_1.AiService, ai_orchestrator_service_1.AiOrchestratorService],
    })
], AiModule);


/***/ },

/***/ "./apps/game-service/src/game/ai_service/ai.orchestrator.service.ts"
/*!**************************************************************************!*\
  !*** ./apps/game-service/src/game/ai_service/ai.orchestrator.service.ts ***!
  \**************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiOrchestratorService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const ai_service_1 = __webpack_require__(/*! ./ai.service */ "./apps/game-service/src/game/ai_service/ai.service.ts");
const player_service_1 = __webpack_require__(/*! ../player/player.service */ "./apps/game-service/src/game/player/player.service.ts");
let AiOrchestratorService = class AiOrchestratorService {
    aiService;
    playerService;
    constructor(aiService, playerService) {
        this.aiService = aiService;
        this.playerService = playerService;
    }
    async spawnBotsForRoom(round, totalRounds, count) {
        const usedNames = new Set();
        const bots = [];
        for (let i = 0; i < count; i++) {
            const botId = this.aiService.generateBotId();
            const botName = this.aiService.pickBotName(usedNames);
            const bot = this.aiService.createBotPlayer('hardcoded', round, totalRounds, botId, undefined, botName);
            bot.roundsRemaining = totalRounds;
            this.playerService.injectPlayer(botId, bot);
            bots.push(bot);
        }
        return bots;
    }
    takeoverPlayer(round, totalRounds, player) {
        this.aiService.createBotPlayer('takeover', round, totalRounds, undefined, player);
    }
    decideBattleTeam(bot, enemy) {
        return this.aiService.chooseBattleTeam(bot.team, enemy.team);
    }
    decideCombatAction(bot, enemy) {
        return this.aiService.decideCombatAction(bot, enemy);
    }
    getLobbySkin(bot) {
        return this.aiService.getLobbySkin(bot.asset);
    }
};
exports.AiOrchestratorService = AiOrchestratorService;
exports.AiOrchestratorService = AiOrchestratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof ai_service_1.AiService !== "undefined" && ai_service_1.AiService) === "function" ? _a : Object, typeof (_b = typeof player_service_1.PlayerService !== "undefined" && player_service_1.PlayerService) === "function" ? _b : Object])
], AiOrchestratorService);


/***/ },

/***/ "./apps/game-service/src/game/ai_service/ai.service.ts"
/*!*************************************************************!*\
  !*** ./apps/game-service/src/game/ai_service/ai.service.ts ***!
  \*************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AiService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const crypto_1 = __webpack_require__(/*! crypto */ "crypto");
const player_1 = __webpack_require__(/*! ../player/player */ "./apps/game-service/src/game/player/player.ts");
const bot_data_1 = __webpack_require__(/*! ./bot.data */ "./apps/game-service/src/game/ai_service/bot.data.ts");
let AiService = AiService_1 = class AiService {
    logger = new common_1.Logger(AiService_1.name);
    pickBotName(usedNames) {
        const available = bot_data_1.BOT_NAMES.filter((name) => !usedNames.has(name));
        const pool = available.length > 0 ? available : bot_data_1.BOT_NAMES;
        const name = pool[Math.floor(Math.random() * pool.length)];
        usedNames.add(name);
        return name;
    }
    pickBotSkin() {
        return bot_data_1.BOT_SKIN_PAIRS[Math.floor(Math.random() * bot_data_1.BOT_SKIN_PAIRS.length)];
    }
    getLobbySkin(gameSkin) {
        const pair = bot_data_1.BOT_SKIN_PAIRS.find((p) => p.game === gameSkin);
        return pair?.lobby ?? bot_data_1.BOT_SKIN_PAIRS[0].lobby;
    }
    typeChart = {
        fire: { plant: 2, water: 0.5, neutral: 1, earth: 1, fly: 1 },
        water: { fire: 2, plant: 0.5, earth: 0.5, neutral: 1, fly: 1 },
        earth: { water: 2, fire: 0.5, plant: 0.5, neutral: 1, fly: 1 },
        plant: { water: 2, earth: 2, neutral: 1, fire: 0.5, fly: 0.5 },
        neutral: { water: 1, fire: 1, plant: 1, earth: 1, fly: 1 },
        fly: { water: 1, fire: 1, plant: 2, earth: 0.5, neutral: 1 },
    };
    chooseBattleTeam(botTeam, enemyTeam) {
        const enemyTypes = enemyTeam
            .filter((name) => name !== '')
            .map((name) => bot_data_1.MONSTER_TYPES[name])
            .filter((type) => !!type);
        const scored = botTeam
            .filter((name) => name !== '')
            .map((name) => {
            const type = bot_data_1.MONSTER_TYPES[name];
            const score = enemyTypes.length === 0
                ? 1
                : enemyTypes.reduce((sum, enemyType) => sum + (this.typeChart[type]?.[enemyType] ?? 1), 0) / enemyTypes.length;
            return { name, score };
        });
        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, 3).map((entry) => entry.name);
    }
    decideCombatAction(bot, enemy) {
        if (bot.currentMonster.name === '' || bot.currentMonster.life.current <= 0) {
            const slot = this.pickBestMonsterSlot(bot, enemy);
            const chosen = bot.battle_team[slot];
            this.logger.log(`[AiService] Bot ${bot.id} envoie ${chosen?.name ?? '?'} (type: ${chosen?.type ?? '?'}, ${chosen?.life?.current ?? '?'}/${chosen?.life?.max ?? '?'} PV, slot ${slot})`);
            return { state: 'change_current_monster', slot };
        }
        const itemAction = this.pickUsefulItem(bot, enemy);
        if (itemAction)
            return itemAction;
        const skillName = this.pickBestSkill(bot, enemy);
        if (!skillName)
            return { state: 'pass' };
        return { state: 'try_attack', skill: skillName };
    }
    pickUsefulItem(bot, enemy) {
        const lifeRatio = bot.currentMonster.life.current / bot.currentMonster.life.max;
        const potion = bot.inventory.find((item) => item.name === 'potion' && item.current > 0);
        if (lifeRatio < 0.5 && potion) {
            return { state: 'use_item_combat', item: 'potion' };
        }
        const bomb = bot.inventory.find((item) => item.name === 'bomb' && item.current > 0);
        const enemyLife = enemy.currentMonster.life.current;
        if (bomb && enemyLife > 0 && enemyLife <= bomb.value) {
            return { state: 'use_item_combat', item: 'bomb' };
        }
        return undefined;
    }
    pickBestMonsterSlot(bot, enemy) {
        const enemyType = enemy.currentMonster?.name ? enemy.currentMonster.type : undefined;
        let bestSlot = -1;
        let bestScore = -Infinity;
        bot.battle_team.forEach((monster, slot) => {
            if (monster.name === '' || monster.life.current <= 0)
                return;
            const score = enemyType
                ? (this.typeChart[monster.type]?.[enemyType] ?? 1)
                : monster.attack;
            if (score > bestScore) {
                bestScore = score;
                bestSlot = slot;
            }
        });
        return bestSlot;
    }
    pickBestSkill(bot, enemy) {
        const enemyType = enemy.currentMonster.type;
        const usableSkills = bot.currentMonster.skill.filter((skill) => skill.effect === 'damage' && skill.current > 0);
        if (usableSkills.length === 0)
            return undefined;
        let best = usableSkills[0];
        let bestScore = -Infinity;
        for (const skill of usableSkills) {
            const multiplier = this.typeChart[skill.type]?.[enemyType] ?? 1;
            const score = skill.value * multiplier * skill.repetition;
            if (score > bestScore) {
                bestScore = score;
                best = skill;
            }
        }
        return best.name;
    }
    generateBotId() {
        return `bot-${(0, crypto_1.randomUUID)()}`;
    }
    pickTierName(round, totalRounds) {
        if (totalRounds <= 0)
            return 'faible';
        const progress = round / totalRounds;
        if (progress <= 1 / 3)
            return 'faible';
        if (progress <= 2 / 3)
            return 'moyen';
        return 'fort';
    }
    pickTeamFromTier(tier) {
        const pool = bot_data_1.BOT_TEAM_TIERS[tier];
        return pool[Math.floor(Math.random() * pool.length)];
    }
    equipBotItems(bot, tier) {
        const counts = bot_data_1.BOT_ITEM_COUNTS[tier];
        let slot = 0;
        for (const [name, count] of Object.entries(counts)) {
            if (count <= 0 || slot >= bot.inventory.length)
                continue;
            const meta = bot_data_1.BOT_ITEMS[name];
            if (!meta)
                continue;
            bot.inventory[slot] = {
                name,
                scene: meta.scene,
                type: meta.type,
                current: count,
                value: meta.value,
                target: '',
            };
            slot++;
        }
    }
    createBotPlayer(mode, round, totalRounds, botId, humanToReplace, botName) {
        const tier = this.pickTierName(round, totalRounds);
        if (mode === 'takeover' && humanToReplace) {
            this.logger.log(`[AiService] Prise de contrôle du joueur ${humanToReplace.id} par l'IA (déconnexion)`);
            humanToReplace.isBot = true;
            humanToReplace.team = [...this.pickTeamFromTier(tier)];
            this.equipBotItems(humanToReplace, tier);
            return humanToReplace;
        }
        const team = this.pickTeamFromTier(tier);
        const id = botId ?? this.generateBotId();
        const skinPair = this.pickBotSkin();
        const bot = new player_1.Player(id, botName ?? 'Bot IA', "-1", skinPair.game);
        bot.isBot = true;
        bot.team = [...team];
        this.equipBotItems(bot, tier);
        this.logger.log(`[AiService] Instanciation du bot ${id} (round ${round}/${totalRounds}, palier ${tier}, skin ${skinPair.lobby}), équipe: ${team.join(', ')}`);
        return bot;
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)()
], AiService);


/***/ },

/***/ "./apps/game-service/src/game/ai_service/bot.data.ts"
/*!***********************************************************!*\
  !*** ./apps/game-service/src/game/ai_service/bot.data.ts ***!
  \***********************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BOT_SKIN_PAIRS = exports.BOT_NAMES = exports.BOT_ITEM_COUNTS = exports.BOT_ITEMS = exports.MONSTER_TYPES = exports.BOT_TEAM_TIERS = void 0;
exports.BOT_TEAM_TIERS = {
    faible: [
        ['fishet', 'squirel', 'leafs', 'burpy', 'papate', 'monkel'],
        ['sharky', 'squirel', 'leafs', 'burpy', 'papate', 'monkel'],
        ['fishet', 'squirel', 'leafs', 'burpy', 'papate', 'gigantomakia'],
        ['fishet', 'squirel', 'leafs', 'burpy', 'pigeonne', 'monkel'],
    ],
    moyen: [
        ['pisciner',],
        ['pisciner',],
        ['pisciner',],
    ],
    fort: [
        ['pisciner',],
        ['pisciner',],
        ['pisciner',],
    ],
};
exports.MONSTER_TYPES = {
    pisciner: 'neutral',
    fishet: 'water',
    burpy: 'water',
    sharky: 'water',
    squirel: 'neutral',
    papate: 'earth',
    gigantomakia: 'earth',
    monkel: 'neutral',
    pigeonne: 'fly',
    leafs: 'plant',
};
exports.BOT_ITEMS = {
    potion: { scene: 'combat', type: 'heal', value: 50 },
    bomb: { scene: 'combat', type: 'damage', value: 50 },
};
exports.BOT_ITEM_COUNTS = {
    faible: { potion: 1, bomb: 1 },
    moyen: { potion: 2, bomb: 2 },
    fort: { potion: 3, bomb: 3 },
};
exports.BOT_NAMES = [
    'Didier',
    'Thierry',
    'Bernard',
    'Gérard',
    'Roger',
    'Ginette',
    'Josiane',
    'Chantal',
    'Monique',
];
exports.BOT_SKIN_PAIRS = [
    { lobby: 'DinoGreen', game: 'dinogreen' },
    { lobby: 'DinoBlue', game: 'dinoblue' },
    { lobby: 'DinoRed', game: 'dinored' },
    { lobby: 'DinoYellow', game: 'dinoyellow' },
    { lobby: 'Ghost', game: 'ghost' },
    { lobby: 'Ghost02', game: 'ghost02' },
    { lobby: 'Ghost03', game: 'ghost03' },
    { lobby: 'Satyr01', game: 'satyr01' },
    { lobby: 'Satyr02', game: 'satyr02' },
    { lobby: 'Satyr03', game: 'satyr03' },
];


/***/ },

/***/ "./apps/game-service/src/game/combat.service.ts"
/*!******************************************************!*\
  !*** ./apps/game-service/src/game/combat.service.ts ***!
  \******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CombatService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const crypto_1 = __webpack_require__(/*! crypto */ "crypto");
let CombatService = class CombatService {
    combatRooms = new Map();
    playerCombatRoom = new Map();
    matchmake(roomPlayers) {
        const players = [...roomPlayers];
        while (players.length >= 2) {
            const indexA = Math.floor(Math.random() * players.length);
            const [userIdA] = players.splice(indexA, 1);
            const indexB = Math.floor(Math.random() * players.length);
            const [userIdB] = players.splice(indexB, 1);
            const combatRoomId = (0, crypto_1.randomUUID)();
            this.combatRooms.set(combatRoomId, [userIdA, userIdB]);
            this.playerCombatRoom.set(userIdA, combatRoomId);
            this.playerCombatRoom.set(userIdB, combatRoomId);
        }
        if (players.length === 1) {
            console.log(`[CombatService] ${players[0]} left without an opponent `);
        }
    }
    getOpponentId(userId) {
        const combatRoomId = this.playerCombatRoom.get(userId);
        if (!combatRoomId)
            return undefined;
        const [userIdA, userIdB] = this.combatRooms.get(combatRoomId);
        return userIdA === userId ? userIdB : userIdA;
    }
    resolve_first(player1, player2) {
        const speed1 = player1.currentMonster['speed'];
        const speed2 = player2.currentMonster['speed'];
        if (player1.currentActions.actionType === player2.currentActions.actionType) {
            if (speed1 === speed2) {
                return Math.random() < 0.5 ? player1 : player2;
            }
            return speed1 > speed2 ? player1 : player2;
        }
        if (player1.currentActions.actionType === 'change_current_monster' ||
            player2.currentActions.actionType === 'change_current_monster') {
            return player1.currentActions.actionType === 'change_current_monster'
                ? player1
                : player2;
        }
        if (player1.currentActions.actionType === 'pass' ||
            player2.currentActions.actionType === 'pass') {
            return player1.currentActions.actionType === 'pass' ? player1 : player2;
        }
        if (player1.currentActions.actionType === 'use_item_combat' ||
            player2.currentActions.actionType === 'use_item_combat') {
            return player1.currentActions.actionType === 'use_item_combat'
                ? player1
                : player2;
        }
        return player1;
    }
    handle_action(player, enemy, actionPlayer, order) {
        switch (actionPlayer.actionType) {
            case 'try_attack':
                this.received_try_attack(player, enemy, actionPlayer.data?.skill);
                break;
            case 'use_item_combat':
                this.received_use_item_combat(player, enemy, actionPlayer.data?.item);
                break;
            case 'change_current_monster':
                this.received_change_current_monster(player, actionPlayer.data?.slot);
                break;
            case 'pass':
                this.received_pass(player);
                break;
            default:
                this.received_pass(player);
        }
    }
    pushResult(map, playerId, result) {
        const arr = map.get(playerId);
        if (arr)
            arr.push(result);
        else
            map.set(playerId, [result]);
    }
    resolving_battle_round(player1, player2) {
        let map_result = new Map();
        let first = this.resolve_first(player1, player2);
        let second = first === player1 ? player2 : player1;
        const actionFirst = first.currentActions;
        const actionSecond = second.currentActions;
        let changeMonsterFirst = undefined;
        let changeMonsterSecond = undefined;
        if (actionFirst.actionType == 'change_current_monster')
            changeMonsterFirst = first.id;
        this.handle_action(first, second, actionFirst, 1);
        second.text = first.text;
        let temp1 = structuredClone(first);
        let temp2 = structuredClone(second);
        this.pushResult(map_result, first.id, this.action_battle(temp1, temp2, 1, 1, changeMonsterFirst));
        this.pushResult(map_result, second.id, this.action_battle(temp2, temp1, 1, 1, changeMonsterFirst));
        if ((second.currentMonster.name !== '' &&
            second.currentMonster.life.current <= 0) ||
            first.forceChooseMonster) {
            if (first.forceChooseMonster) {
                first.forceChooseMonster = false;
            }
            return map_result;
        }
        if (actionSecond.actionType == 'change_current_monster')
            changeMonsterSecond = second.id;
        this.handle_action(second, first, actionSecond, 2);
        first.text = second.text;
        this.pushResult(map_result, first.id, this.action_battle(first, second, 2, 2, changeMonsterSecond));
        this.pushResult(map_result, second.id, this.action_battle(second, first, 2, 2, changeMonsterSecond));
        return map_result;
    }
    action_battle(player, player2, order, max, changePlayerID) {
        let result = {
            event: 'game',
            data: {
                state: 'action_battle',
                order: order,
                max: max,
                change_monster: '-1',
                player: player,
                enemy: player2,
            },
        };
        if (changePlayerID && changePlayerID !== undefined)
            result.data.change_monster = changePlayerID;
        return result;
    }
    result_battle(player, win_id) {
        let result = {
            event: 'game',
            data: {
                state: '',
            },
        };
        if (player.id === win_id) {
            result.data.state = 'win';
            player.playerDefeated += 1;
        }
        else {
            player.lose = true;
            result.data.state = 'lose';
        }
        return result;
    }
    change_monster(player, id) {
        let result = {
            event: 'game',
            data: {
                state: '',
                timer: player.timer,
                player: player,
                time: 0,
            },
        };
        if (id != player.id) {
            player.text = 'Wait for your opponent to switch monsters';
            result.data.state = 'enemy_change_monster';
        }
        else {
            player.text =
                player.currentMonster.name + ' has died. Change your monster';
            result.data.state = 'change_monster';
        }
        return result;
    }
    new_turn(player, roundLeft) {
        let result = {
            event: 'game',
            data: {
                state: 'new_turn',
                timer: player.timer,
                player: player,
            },
        };
        if (roundLeft !== undefined)
            result.data.player.text =
                'The fight will end in ' + String(roundLeft) + ' rounds.';
        else
            result.data.player.text = '';
        return result;
    }
    next_map(player) {
        return {
            event: 'game',
            data: {
                state: 'next_map',
                timer: player.timer,
                current_map: 'map_01',
                player: player,
            },
        };
    }
    typeChart = {
        fire: { plant: 1.5, water: 0.5, neutral: 1, earth: 1, fly: 1 },
        water: { fire: 1.5, plant: 0.5, earth: 1, neutral: 1, fly: 1 },
        earth: { water: 1.5, fire: 0.5, plant: 0.5, neutral: 1, fly: 1 },
        plant: { water: 1.5, earth: 1, neutral: 1, fire: 0.5, fly: 0.5 },
        neutral: { water: 1, fire: 1, plant: 1, earth: 1, fly: 1 },
        fly: { water: 1, fire: 1, plant: 1.5, earth: 0.5, neutral: 1 },
    };
    received_try_attack(player, enemy, skillName) {
        const skill = player.currentMonster.skill.find((s) => s.name === skillName);
        if (enemy == null ||
            enemy.currentMonster == null ||
            skill == null ||
            skill.current <= 0) {
            if (skill == null) {
                this.received_pass(player);
                return;
            }
            else {
                player.text = player.currentMonster.name + ' failed to use ' + skillName;
                return;
            }
        }
        let i = 0;
        let touch = 0;
        let resultDamage = 0;
        let effectiveness = '.';
        skill.current -= 1;
        switch (skill.effect) {
            case 'damage':
                if (enemy.currentMonster.dodge === true) {
                    player.text =
                        player.currentMonster.name +
                            ' used ' +
                            skillName +
                            ' on ' +
                            enemy.currentMonster.name +
                            ' but he dodged.';
                    enemy.currentMonster.dodge = false;
                }
                else {
                    player.text =
                        player.currentMonster.name +
                            ' used ' +
                            skillName +
                            ' on ' +
                            enemy.currentMonster.name;
                    while (i++ < skill.repetition) {
                        if (enemy.currentMonster.life.current <= 0) {
                            break;
                        }
                        const attackSuccess = this.successAttackCalculation(skill, enemy.currentMonster);
                        if (attackSuccess === false) {
                            if (skill.repetition == 1) {
                                player.text =
                                    enemy.currentMonster.name + ' dodged ' + skillName + '.';
                                return;
                            }
                            else {
                                continue;
                            }
                        }
                        touch++;
                        const resultAttack = this.attackResult(player, skill.type, skill.value, enemy, enemy.currentMonster.type, player.currentMonster.type);
                        if (resultAttack.result >= enemy.currentMonster.life.current)
                            resultAttack.result = enemy.currentMonster.life.current;
                        if (resultAttack.effectiveness != '')
                            effectiveness = resultAttack.effectiveness;
                        resultDamage += resultAttack.result;
                        enemy.currentMonster.life.current -= resultAttack.result;
                    }
                    if (skill.repetition > 1) {
                        if (resultDamage > 0)
                            player.text +=
                                ' and hit ' + touch + ' times for ' + resultDamage + ' damage';
                        else
                            player.text =
                                enemy.currentMonster.name +
                                    ' dodged ' +
                                    skillName +
                                    ' ' +
                                    touch +
                                    ' times.';
                    }
                    else
                        player.text += ' for ' + resultDamage + ' damage';
                }
                player.text += effectiveness;
                break;
            case 'up_stat':
                const target_up = skill.data;
                switch (target_up) {
                    case 'defense':
                        player.currentMonster.defense += skill.value;
                        player.currentMonster.defense_spe += skill.value;
                        break;
                    case 'speed':
                        player.currentMonster.speed += skill.value;
                        break;
                    case 'attack':
                        player.currentMonster.attack += skill.value;
                        player.currentMonster.attack_spe += skill.value;
                        break;
                    default:
                        this.received_pass(player);
                }
                player.text =
                    player.currentMonster.name +
                        ' used ' +
                        skillName +
                        ' to boost its ' +
                        target_up;
                break;
            case 'down_stat':
                const target_down = skill.data;
                switch (target_down) {
                    case 'defense':
                        if (enemy.currentMonster.defense <= 0 &&
                            enemy.currentMonster.defense_spe <= 0) {
                            player.text =
                                player.currentMonster.name +
                                    ' used ' +
                                    skillName +
                                    ' but ' +
                                    enemy.currentMonster.name +
                                    ' ' +
                                    target_down +
                                    " won't go any lower.";
                        }
                        else {
                            player.text =
                                player.currentMonster.name +
                                    ' used ' +
                                    skillName +
                                    ' and decreased ' +
                                    enemy.currentMonster.name +
                                    ' ' +
                                    target_down +
                                    '.';
                            enemy.currentMonster.defense -= skill.value;
                            if (enemy.currentMonster.defense < 0) {
                                enemy.currentMonster.defense = 0;
                            }
                            enemy.currentMonster.defense_spe -= skill.value;
                            if (enemy.currentMonster.defense_spe < 0) {
                                enemy.currentMonster.defense_spe = 0;
                            }
                        }
                        break;
                    case 'speed':
                        if (enemy.currentMonster.speed <= 0) {
                            player.text =
                                player.currentMonster.name +
                                    ' used ' +
                                    skillName +
                                    ' but ' +
                                    enemy.currentMonster.name +
                                    ' ' +
                                    target_down +
                                    " won't go any lower.";
                        }
                        else {
                            player.text =
                                player.currentMonster.name +
                                    ' used ' +
                                    skillName +
                                    ' and decreased ' +
                                    enemy.currentMonster.name +
                                    ' ' +
                                    target_down +
                                    '.';
                            enemy.currentMonster.speed -= skill.value;
                        }
                        break;
                    case 'attack':
                        if (enemy.currentMonster.attack <= 0 &&
                            enemy.currentMonster.attack_spe <= 0) {
                            player.text =
                                player.currentMonster.name +
                                    ' used ' +
                                    skillName +
                                    ' but ' +
                                    enemy.currentMonster.name +
                                    ' ' +
                                    target_down +
                                    " won't go any lower.";
                        }
                        else {
                            player.text =
                                player.currentMonster.name +
                                    ' used ' +
                                    skillName +
                                    ' and decreased ' +
                                    enemy.currentMonster.name +
                                    ' ' +
                                    target_down +
                                    '.';
                            enemy.currentMonster.attack -= skill.value;
                            if (enemy.currentMonster.attack < 0) {
                                enemy.currentMonster.attack = 0;
                            }
                            enemy.currentMonster.attack_spe -= skill.value;
                            if (enemy.currentMonster.attack_spe < 0) {
                                enemy.currentMonster.attack_spe = 0;
                            }
                        }
                        break;
                    default:
                        this.received_pass(player);
                        return;
                }
                break;
            case 'dodge':
                player.currentMonster.dodge = true;
                player.text =
                    player.currentMonster.name +
                        ' used ' +
                        skillName +
                        ' and are ready to dodge the next attack.';
                break;
            default:
                this.received_pass(player);
                return;
        }
    }
    successAttackCalculation(skill, enemyMonster) {
        let result = Math.floor(Math.random() * 100);
        result += enemyMonster.speed / 10;
        if (result > skill.precision)
            return false;
        return true;
    }
    attackResult(player, attackType, skillValue, enemy, enemyType, monsterType) {
        let flatAttackDammage = player.currentMonster['attack'];
        if (attackType == monsterType)
            flatAttackDammage = player.currentMonster['attack_spe'];
        let effectiveness = '.';
        let multi = this.typeChart[attackType]?.[enemyType] ?? 1;
        if (multi >= 1.5)
            effectiveness = ". It's super effective !";
        else if (multi <= 0.5)
            effectiveness = ". It's not very effective..";
        let result = Math.trunc(flatAttackDammage * multi);
        result = Math.trunc(result * skillValue);
        if (attackType == enemyType)
            result -= enemy.currentMonster.defense_spe;
        else
            result -= enemy.currentMonster.defense;
        if (result <= 0)
            result = 0;
        return { result, effectiveness };
    }
    received_use_item_combat(player, enemy, item) {
        let i = 0;
        for (i; i < player.inventory.length; ++i) {
            if (player.inventory[i]['name'] === item) {
                break;
            }
        }
        if (i >= player.inventory.length || player.inventory[i]['current'] <= 0) {
            this.received_pass(player);
            return;
        }
        let current_item = player.inventory[i];
        current_item.current -= 1;
        const type = current_item.type;
        switch (type) {
            case 'heal':
                console.log('3 type: ', type);
                let result_heal = current_item.value;
                let temp_life_heal = player.currentMonster.life.current;
                player.currentMonster.life.current += current_item.value;
                if (player.currentMonster.life.current > player.currentMonster.life.max) {
                    result_heal = player.currentMonster.life.max - temp_life_heal;
                    player.currentMonster.life.current = player.currentMonster.life.max;
                }
                player.text =
                    player.name +
                        ' used ' +
                        item +
                        ' on ' +
                        player.currentMonster.name +
                        ' and restored ' +
                        result_heal +
                        ' HP.';
                break;
            case 'damage':
                console.log('3 type: ', type);
                let result_damage = current_item.value;
                let temp_life_damage = enemy.currentMonster.life.current;
                enemy.currentMonster.life.current -= current_item.value;
                if (enemy.currentMonster.life.current <= 0) {
                    result_damage = temp_life_damage;
                    enemy.currentMonster.life.current = 0;
                }
                player.text =
                    player.name +
                        ' used ' +
                        item +
                        ' on ' +
                        enemy.currentMonster.name +
                        ' and dealt ' +
                        result_damage +
                        ' damage.';
                break;
            case 'stat_down':
                console.log('3 type: ', type);
                console.log('stat_up: ', current_item.name);
                console.log('target: ', current_item.target);
                const target = current_item.target;
                switch (target) {
                    case 'attack':
                        enemy.currentMonster.attack -= current_item.value;
                        enemy.currentMonster.attack_spe -= current_item.value;
                        break;
                    case 'defense':
                        enemy.currentMonster.defense -= current_item.value;
                        enemy.currentMonster.defense_spe -= current_item.value;
                        break;
                    case 'speed':
                        enemy.currentMonster.speed -= current_item.value;
                        break;
                    default:
                        this.received_pass(player);
                        return;
                }
                player.text =
                    player.name +
                        ' used ' +
                        item +
                        ' on ' +
                        enemy.currentMonster.name +
                        ' to lower ' +
                        current_item.target +
                        '.';
                break;
            case 'stat_up':
                console.log('3 type: ', type);
                switch (current_item.target) {
                    case 'attack':
                        player.currentMonster.attack += current_item.value;
                        player.currentMonster.attack_spe += current_item.value;
                        break;
                    case 'defense':
                        player.currentMonster.defense += current_item.value;
                        player.currentMonster.defense_spe += current_item.value;
                        break;
                    case 'speed':
                        player.currentMonster.speed += current_item.value;
                        break;
                    default:
                        this.received_pass(player);
                        return;
                }
                player.text =
                    player.name +
                        ' used ' +
                        item +
                        ' on ' +
                        player.currentMonster.name +
                        ', ' +
                        current_item.target +
                        ' increased.';
                break;
            default:
                console.log('3 type: ', type);
                this.received_pass(player);
                return;
        }
        current_item['current'] -= 1;
        if (current_item['current'] === 0) {
            current_item['name'] = '';
            current_item['scene'] = '';
            current_item['target'] = '';
            current_item['type'] = '';
            current_item['value'] = 0;
        }
    }
    received_change_current_monster(player, slot) {
        let temp = '';
        if (player.currentMonster.name !== '')
            temp = player.currentMonster.name;
        if (player.currentMonster.name === '' &&
            slot >= 0 &&
            slot <= 2 &&
            player.battle_team[slot]['name'] != '' &&
            player.battle_team[slot]['life']['current'] > 0) {
            player.currentMonster = player.battle_team[slot];
            player.text = player.name + ' call ' + player.currentMonster.name;
        }
        else if (slot >= 0 &&
            slot <= 2 &&
            player.battle_team[slot]['name'] != '' &&
            player.battle_team[slot]['life']['current'] > 0) {
            player.currentMonster = player.battle_team[slot];
            if (temp !== '')
                player.text =
                    player.name +
                        ' switched ' +
                        temp +
                        ' for ' +
                        player.currentMonster.name;
        }
        else {
            for (let i = 0; i < player.battle_team.length; ++i) {
                if (player.battle_team[i]['name'] != '' &&
                    player.battle_team[i]['life']['current'] != 0) {
                    player.currentMonster = player.battle_team[i];
                    player.text =
                        player.name +
                            ' switched ' +
                            temp +
                            ' for ' +
                            player.currentMonster.name;
                    break;
                }
            }
        }
    }
    received_pass(player) {
        player.text = player.name + ' pass for this turn.';
    }
};
exports.CombatService = CombatService;
exports.CombatService = CombatService = __decorate([
    (0, common_1.Injectable)()
], CombatService);


/***/ },

/***/ "./apps/game-service/src/game/entities/entity.module.ts"
/*!**************************************************************!*\
  !*** ./apps/game-service/src/game/entities/entity.module.ts ***!
  \**************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const monsters_service_1 = __webpack_require__(/*! ./monsters.service */ "./apps/game-service/src/game/entities/monsters.service.ts");
const items_service_1 = __webpack_require__(/*! ./items.service */ "./apps/game-service/src/game/entities/items.service.ts");
const tiles_service_1 = __webpack_require__(/*! ./tiles.service */ "./apps/game-service/src/game/entities/tiles.service.ts");
const monsters_entity_1 = __webpack_require__(/*! ./monsters.entity */ "./apps/game-service/src/game/entities/monsters.entity.ts");
const skills_entity_1 = __webpack_require__(/*! ./skills.entity */ "./apps/game-service/src/game/entities/skills.entity.ts");
const tiles_entity_1 = __webpack_require__(/*! ./tiles.entity */ "./apps/game-service/src/game/entities/tiles.entity.ts");
const items_entity_1 = __webpack_require__(/*! ./items.entity */ "./apps/game-service/src/game/entities/items.entity.ts");
const maps_entity_1 = __webpack_require__(/*! ./maps.entity */ "./apps/game-service/src/game/entities/maps.entity.ts");
const maps_service_1 = __webpack_require__(/*! ./maps.service */ "./apps/game-service/src/game/entities/maps.service.ts");
let EntityModule = class EntityModule {
};
exports.EntityModule = EntityModule;
exports.EntityModule = EntityModule = __decorate([
    (0, common_1.Module)({
        providers: [monsters_service_1.MonstersService, tiles_service_1.TilesService, items_service_1.ItemsService, maps_service_1.MapsService],
        imports: [typeorm_1.TypeOrmModule.forFeature([maps_entity_1.MapEntity, tiles_entity_1.Tile, monsters_entity_1.Monster, skills_entity_1.Skill, items_entity_1.Item])],
        exports: [monsters_service_1.MonstersService, tiles_service_1.TilesService, items_service_1.ItemsService, maps_service_1.MapsService],
    })
], EntityModule);


/***/ },

/***/ "./apps/game-service/src/game/entities/items.entity.ts"
/*!*************************************************************!*\
  !*** ./apps/game-service/src/game/entities/items.entity.ts ***!
  \*************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Item = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const monster_stat_enum_1 = __webpack_require__(/*! ./types/monster_stat.enum */ "./apps/game-service/src/game/entities/types/monster_stat.enum.ts");
const item_type_enum_1 = __webpack_require__(/*! ./types/item_type.enum */ "./apps/game-service/src/game/entities/types/item_type.enum.ts");
let Item = class Item {
    id;
    name;
    value;
    target;
    scene;
    type;
};
exports.Item = Item;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Item.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Item.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Item.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: item_type_enum_1.ItemType,
        name: 'type',
        nullable: true,
    }),
    __metadata("design:type", typeof (_a = typeof monster_stat_enum_1.MonsterStat !== "undefined" && monster_stat_enum_1.MonsterStat) === "function" ? _a : Object)
], Item.prototype, "target", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Item.prototype, "scene", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: item_type_enum_1.ItemType,
        name: 'type',
        nullable: true,
    }),
    __metadata("design:type", String)
], Item.prototype, "type", void 0);
exports.Item = Item = __decorate([
    (0, typeorm_1.Entity)('items')
], Item);


/***/ },

/***/ "./apps/game-service/src/game/entities/items.service.ts"
/*!**************************************************************!*\
  !*** ./apps/game-service/src/game/entities/items.service.ts ***!
  \**************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ItemsService = void 0;
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const items_entity_1 = __webpack_require__(/*! ./items.entity */ "./apps/game-service/src/game/entities/items.entity.ts");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
let ItemsService = class ItemsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    findAll(relations = {}) {
        return this.repo.find({
            relations,
        });
    }
};
exports.ItemsService = ItemsService;
exports.ItemsService = ItemsService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(items_entity_1.Item)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], ItemsService);


/***/ },

/***/ "./apps/game-service/src/game/entities/maps.entity.ts"
/*!************************************************************!*\
  !*** ./apps/game-service/src/game/entities/maps.entity.ts ***!
  \************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MapEntity = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const tiles_entity_1 = __webpack_require__(/*! ./tiles.entity */ "./apps/game-service/src/game/entities/tiles.entity.ts");
let MapEntity = class MapEntity {
    id;
    name;
    tiles;
};
exports.MapEntity = MapEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MapEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], MapEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => tiles_entity_1.Tile, (tile) => tile.maps),
    (0, typeorm_1.JoinTable)({
        name: 'maps_tiles',
        joinColumn: {
            name: 'map_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'tile_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], MapEntity.prototype, "tiles", void 0);
exports.MapEntity = MapEntity = __decorate([
    (0, typeorm_1.Entity)('maps')
], MapEntity);


/***/ },

/***/ "./apps/game-service/src/game/entities/maps.service.ts"
/*!*************************************************************!*\
  !*** ./apps/game-service/src/game/entities/maps.service.ts ***!
  \*************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MapsService = void 0;
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const maps_entity_1 = __webpack_require__(/*! ./maps.entity */ "./apps/game-service/src/game/entities/maps.entity.ts");
let MapsService = class MapsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    findOneById(id, relations = {}) {
        return this.repo.findOne({
            where: { id },
            relations,
        });
    }
    findOneByName(name, relations = {}) {
        return this.repo.findOne({
            where: { name },
            relations,
        });
    }
};
exports.MapsService = MapsService;
exports.MapsService = MapsService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(maps_entity_1.MapEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], MapsService);


/***/ },

/***/ "./apps/game-service/src/game/entities/monsters.entity.ts"
/*!****************************************************************!*\
  !*** ./apps/game-service/src/game/entities/monsters.entity.ts ***!
  \****************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Monster = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const monster_type_enum_1 = __webpack_require__(/*! ./types/monster_type.enum */ "./apps/game-service/src/game/entities/types/monster_type.enum.ts");
const skills_entity_1 = __webpack_require__(/*! ./skills.entity */ "./apps/game-service/src/game/entities/skills.entity.ts");
const tiles_entity_1 = __webpack_require__(/*! ./tiles.entity */ "./apps/game-service/src/game/entities/tiles.entity.ts");
const monster_rarity_enum_1 = __webpack_require__(/*! ./types/monster_rarity.enum */ "./apps/game-service/src/game/entities/types/monster_rarity.enum.ts");
let Monster = class Monster {
    id;
    name;
    hp_total;
    attack;
    attack_spe;
    defense;
    defense_spe;
    speed;
    type;
    rarity;
    skills;
    tiles;
};
exports.Monster = Monster;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Monster.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Monster.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Monster.prototype, "hp_total", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Monster.prototype, "attack", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Monster.prototype, "attack_spe", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Monster.prototype, "defense", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Monster.prototype, "defense_spe", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Monster.prototype, "speed", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: monster_type_enum_1.MonsterType,
    }),
    __metadata("design:type", typeof (_a = typeof monster_type_enum_1.MonsterType !== "undefined" && monster_type_enum_1.MonsterType) === "function" ? _a : Object)
], Monster.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: monster_rarity_enum_1.MonsterRarity,
    }),
    __metadata("design:type", typeof (_b = typeof monster_rarity_enum_1.MonsterRarity !== "undefined" && monster_rarity_enum_1.MonsterRarity) === "function" ? _b : Object)
], Monster.prototype, "rarity", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => skills_entity_1.Skill, (skill) => skill.monsters),
    (0, typeorm_1.JoinTable)({
        name: 'monsters_skills',
        joinColumn: {
            name: 'monster_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'skill_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Monster.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => tiles_entity_1.Tile, (tile) => tile.monsters),
    __metadata("design:type", Array)
], Monster.prototype, "tiles", void 0);
exports.Monster = Monster = __decorate([
    (0, typeorm_1.Entity)('monsters')
], Monster);


/***/ },

/***/ "./apps/game-service/src/game/entities/monsters.service.ts"
/*!*****************************************************************!*\
  !*** ./apps/game-service/src/game/entities/monsters.service.ts ***!
  \*****************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonstersService = void 0;
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const monsters_entity_1 = __webpack_require__(/*! ./monsters.entity */ "./apps/game-service/src/game/entities/monsters.entity.ts");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
let MonstersService = class MonstersService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    findOneById(id, relations = {}) {
        return this.repo.findOne({
            where: { id },
            relations,
        });
    }
    findOneByName(name, relations = {}) {
        return this.repo.findOne({
            where: { name },
            relations,
        });
    }
    findMonstersByTile(tileId, relations = {}) {
        return this.repo.find({
            where: {
                tiles: {
                    id: tileId,
                },
            },
            relations,
        });
    }
};
exports.MonstersService = MonstersService;
exports.MonstersService = MonstersService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(monsters_entity_1.Monster)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], MonstersService);


/***/ },

/***/ "./apps/game-service/src/game/entities/skills.entity.ts"
/*!**************************************************************!*\
  !*** ./apps/game-service/src/game/entities/skills.entity.ts ***!
  \**************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Skill = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const skill_effect_enum_1 = __webpack_require__(/*! ./types/skill_effect.enum */ "./apps/game-service/src/game/entities/types/skill_effect.enum.ts");
const skill_type_entity_1 = __webpack_require__(/*! ./types/skill_type.entity */ "./apps/game-service/src/game/entities/types/skill_type.entity.ts");
const monster_stat_enum_1 = __webpack_require__(/*! ./types/monster_stat.enum */ "./apps/game-service/src/game/entities/types/monster_stat.enum.ts");
const monsters_entity_1 = __webpack_require__(/*! ./monsters.entity */ "./apps/game-service/src/game/entities/monsters.entity.ts");
let Skill = class Skill {
    id;
    name;
    power_point;
    effect;
    type;
    value;
    repetition;
    precision;
    data;
    monsters;
};
exports.Skill = Skill;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Skill.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Skill.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Skill.prototype, "power_point", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: skill_effect_enum_1.SkillEffect,
    }),
    __metadata("design:type", typeof (_a = typeof skill_effect_enum_1.SkillEffect !== "undefined" && skill_effect_enum_1.SkillEffect) === "function" ? _a : Object)
], Skill.prototype, "effect", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: skill_type_entity_1.SkillType,
    }),
    __metadata("design:type", typeof (_b = typeof skill_type_entity_1.SkillType !== "undefined" && skill_type_entity_1.SkillType) === "function" ? _b : Object)
], Skill.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision' }),
    __metadata("design:type", Number)
], Skill.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Skill.prototype, "repetition", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Skill.prototype, "precision", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: monster_stat_enum_1.MonsterStat,
    }),
    __metadata("design:type", typeof (_c = typeof monster_stat_enum_1.MonsterStat !== "undefined" && monster_stat_enum_1.MonsterStat) === "function" ? _c : Object)
], Skill.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => monsters_entity_1.Monster, (monster) => monster.skills),
    __metadata("design:type", Array)
], Skill.prototype, "monsters", void 0);
exports.Skill = Skill = __decorate([
    (0, typeorm_1.Entity)('skills')
], Skill);


/***/ },

/***/ "./apps/game-service/src/game/entities/tiles.entity.ts"
/*!*************************************************************!*\
  !*** ./apps/game-service/src/game/entities/tiles.entity.ts ***!
  \*************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Tile = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const maps_entity_1 = __webpack_require__(/*! ./maps.entity */ "./apps/game-service/src/game/entities/maps.entity.ts");
const monsters_entity_1 = __webpack_require__(/*! ./monsters.entity */ "./apps/game-service/src/game/entities/monsters.entity.ts");
let Tile = class Tile {
    id;
    type;
    maps;
    monsters;
};
exports.Tile = Tile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Tile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Tile.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => maps_entity_1.MapEntity, (map) => map.tiles),
    __metadata("design:type", Array)
], Tile.prototype, "maps", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => monsters_entity_1.Monster, (monster) => monster.tiles),
    (0, typeorm_1.JoinTable)({
        name: 'tiles_monsters',
        joinColumn: {
            name: 'tile_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'monster_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Tile.prototype, "monsters", void 0);
exports.Tile = Tile = __decorate([
    (0, typeorm_1.Entity)('tiles')
], Tile);


/***/ },

/***/ "./apps/game-service/src/game/entities/tiles.service.ts"
/*!**************************************************************!*\
  !*** ./apps/game-service/src/game/entities/tiles.service.ts ***!
  \**************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TilesService = void 0;
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const tiles_entity_1 = __webpack_require__(/*! ./tiles.entity */ "./apps/game-service/src/game/entities/tiles.entity.ts");
let TilesService = class TilesService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    findOneByType(type, relations = {}) {
        return this.repo.findOne({
            where: { type },
            relations,
        });
    }
};
exports.TilesService = TilesService;
exports.TilesService = TilesService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(tiles_entity_1.Tile)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], TilesService);


/***/ },

/***/ "./apps/game-service/src/game/entities/types/item_type.enum.ts"
/*!*********************************************************************!*\
  !*** ./apps/game-service/src/game/entities/types/item_type.enum.ts ***!
  \*********************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ItemType = void 0;
var ItemType;
(function (ItemType) {
    ItemType["HEAL"] = "heal";
    ItemType["DMG"] = "damage";
    ItemType["CATCH"] = "capture";
    ItemType["STAT_UP"] = "stat_up";
    ItemType["STAT_DOWN"] = "stat_down";
})(ItemType || (exports.ItemType = ItemType = {}));


/***/ },

/***/ "./apps/game-service/src/game/entities/types/monster_rarity.enum.ts"
/*!**************************************************************************!*\
  !*** ./apps/game-service/src/game/entities/types/monster_rarity.enum.ts ***!
  \**************************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonsterRarity = void 0;
var MonsterRarity;
(function (MonsterRarity) {
    MonsterRarity["NEUTRAL"] = "neutral";
    MonsterRarity["FIRE"] = "fire";
    MonsterRarity["WATER"] = "water";
    MonsterRarity["EARTH"] = "earth";
    MonsterRarity["PLANT"] = "plant";
    MonsterRarity["FLY"] = " fly";
})(MonsterRarity || (exports.MonsterRarity = MonsterRarity = {}));


/***/ },

/***/ "./apps/game-service/src/game/entities/types/monster_stat.enum.ts"
/*!************************************************************************!*\
  !*** ./apps/game-service/src/game/entities/types/monster_stat.enum.ts ***!
  \************************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonsterStat = void 0;
var MonsterStat;
(function (MonsterStat) {
    MonsterStat["ATK"] = "attack";
    MonsterStat["ATK_SPE"] = "attack_spe";
    MonsterStat["DEF"] = "defense";
    MonsterStat["DEF_SPE"] = "defense_spe";
    MonsterStat["SPD"] = "speed";
})(MonsterStat || (exports.MonsterStat = MonsterStat = {}));


/***/ },

/***/ "./apps/game-service/src/game/entities/types/monster_type.enum.ts"
/*!************************************************************************!*\
  !*** ./apps/game-service/src/game/entities/types/monster_type.enum.ts ***!
  \************************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonsterType = void 0;
var MonsterType;
(function (MonsterType) {
    MonsterType["NEUTRAL"] = "neutral";
    MonsterType["FIRE"] = "fire";
    MonsterType["WATER"] = "water";
    MonsterType["EARTH"] = "earth";
    MonsterType["PLANT"] = "plant";
    MonsterType["FLY"] = " fly";
})(MonsterType || (exports.MonsterType = MonsterType = {}));


/***/ },

/***/ "./apps/game-service/src/game/entities/types/skill_effect.enum.ts"
/*!************************************************************************!*\
  !*** ./apps/game-service/src/game/entities/types/skill_effect.enum.ts ***!
  \************************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SkillEffect = void 0;
var SkillEffect;
(function (SkillEffect) {
    SkillEffect["DAMAGE"] = "damage";
    SkillEffect["DODGE"] = "dodge";
    SkillEffect["UP_STAT"] = "up_stat";
    SkillEffect["DOWN_STAT"] = "down_stat";
})(SkillEffect || (exports.SkillEffect = SkillEffect = {}));


/***/ },

/***/ "./apps/game-service/src/game/entities/types/skill_type.entity.ts"
/*!************************************************************************!*\
  !*** ./apps/game-service/src/game/entities/types/skill_type.entity.ts ***!
  \************************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SkillType = void 0;
var SkillType;
(function (SkillType) {
    SkillType["NEUTRAL"] = "neutral";
    SkillType["WATER"] = "water";
    SkillType["PLANT"] = "plant";
    SkillType["EARTH"] = "earth";
    SkillType["FLY"] = "fly";
    SkillType["NONE"] = "none";
})(SkillType || (exports.SkillType = SkillType = {}));


/***/ },

/***/ "./apps/game-service/src/game/game.gateway.ts"
/*!****************************************************!*\
  !*** ./apps/game-service/src/game/game.gateway.ts ***!
  \****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameGateway = void 0;
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const schedule_1 = __webpack_require__(/*! @nestjs/schedule */ "@nestjs/schedule");
const ws_1 = __webpack_require__(/*! ws */ "ws");
const game_service_1 = __webpack_require__(/*! ./game.service */ "./apps/game-service/src/game/game.service.ts");
const player_service_1 = __webpack_require__(/*! ./player/player.service */ "./apps/game-service/src/game/player/player.service.ts");
const event_emitter_1 = __webpack_require__(/*! @nestjs/event-emitter */ "@nestjs/event-emitter");
const redis_state_service_1 = __webpack_require__(/*! ../redis/redis_state.service */ "./apps/game-service/src/redis/redis_state.service.ts");
const shared_auth_service_1 = __webpack_require__(/*! libs/shared/src/auth/shared-auth.service */ "./libs/shared/src/auth/shared-auth.service.ts");
let GameGateway = class GameGateway {
    wsAuthService;
    gameService;
    playerService;
    redisStateService;
    server;
    constructor(wsAuthService, gameService, playerService, redisStateService) {
        this.wsAuthService = wsAuthService;
        this.gameService = gameService;
        this.playerService = playerService;
        this.redisStateService = redisStateService;
    }
    clients = new Map();
    clientsById = new Map();
    async handleConnection(client, request) {
        const url = request.url;
        const params = new URLSearchParams(url.split('?')[1]);
        const roomId = params.get('room');
        const user = await this.wsAuthService.verifyWsHandshake(request);
        if (!user.username || !user.id) {
            client.close(1008, 'Unauthorized');
            return;
        }
        const userId = user.username;
        const uID = user.id;
        if (!roomId) {
            console.log('[GameGateway]: Missing roomId');
            client.close(4000, 'Missing roomId');
            return;
        }
        const access = await this.gameService.verifyRoomAccess(userId, roomId);
        if (access === null) {
            client.close(4003, 'Room not found or not authorized');
            return;
        }
        this.clients.set(client, { userId, roomId, isAlive: true });
        this.clientsById.set(userId, client);
        console.log(`[GameGateway]: Client ${userId} connected in room ${roomId}`);
        client.on('pong', () => {
            console.log('pong received');
            const data = this.clients.get(client);
            if (data)
                data.isAlive = true;
        });
        this.gameService.onGodotConnected(userId, uID, roomId, access).catch((err) => {
            console.log('[GameGateway]: handleConnection error');
            client.close();
        });
    }
    handleDisconnect(client) {
        this.cleanupClient(client);
    }
    cleanupClient(client) {
        const user = this.clients.get(client);
        this.clients.delete(client);
        if (!user)
            return;
        this.clientsById.delete(user.userId);
        if (user.roomId) {
            this.gameService.onGodotDisconnected(user.userId, user.roomId);
        }
        console.log(`[GameGateway]: Client ${user?.userId} disconnected`);
    }
    broadcast(clients, message) {
        clients.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN)
                client.send(JSON.stringify(message));
        });
    }
    sendToClient(client, message) {
        if (!message) {
            console.log('[GameGateway] sendToclient called with undefined payload (skipping)');
            return;
        }
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    }
    heartbeat() {
        this.clients.forEach((data, socket) => {
            if (!data.isAlive) {
                socket.terminate();
                this.cleanupClient(socket);
                console.log(`[Heartbeat]: client ${data.userId} terminated`);
                return;
            }
            data.isAlive = false;
            socket.ping();
        });
    }
    async handleGame(client, payload) {
        const clientData = this.clients.get(client);
        if (!clientData) {
            client.close();
            return;
        }
        const userId = clientData.userId;
        try {
            await this.gameService.handleMessage(userId, payload);
        }
        catch (err) {
            console.log('[GameGateway] handleMessage error: ', err);
        }
        const playerState = this.playerService.getPlayer(userId);
        await this.redisStateService.updateStatePlayer(userId.toString(), playerState);
    }
    onSendToPlayer({ userId, payload, }) {
        const client = this.clientsById.get(userId);
        if (client) {
            this.sendToClient(client, payload);
        }
    }
    onSendToRoom({ clients, payload, }) {
        this.broadcast(clients, payload);
    }
    onClosePlayerSocket({ userId }) {
        const client = this.clientsById.get(userId);
        if (client)
            client.close();
    }
};
exports.GameGateway = GameGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_e = typeof ws_1.Server !== "undefined" && ws_1.Server) === "function" ? _e : Object)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, schedule_1.Interval)(30000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "heartbeat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('game'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof ws_1.WebSocket !== "undefined" && ws_1.WebSocket) === "function" ? _f : Object, Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], GameGateway.prototype, "handleGame", null);
__decorate([
    (0, event_emitter_1.OnEvent)('send_to_player'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "onSendToPlayer", null);
__decorate([
    (0, event_emitter_1.OnEvent)('send_to_room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "onSendToRoom", null);
__decorate([
    (0, event_emitter_1.OnEvent)('close_player_socket'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "onClosePlayerSocket", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(8082, { cors: { origin: true }, path: '/game' }),
    __metadata("design:paramtypes", [typeof (_a = typeof shared_auth_service_1.SharedAuthService !== "undefined" && shared_auth_service_1.SharedAuthService) === "function" ? _a : Object, typeof (_b = typeof game_service_1.GameService !== "undefined" && game_service_1.GameService) === "function" ? _b : Object, typeof (_c = typeof player_service_1.PlayerService !== "undefined" && player_service_1.PlayerService) === "function" ? _c : Object, typeof (_d = typeof redis_state_service_1.RedisStateService !== "undefined" && redis_state_service_1.RedisStateService) === "function" ? _d : Object])
], GameGateway);


/***/ },

/***/ "./apps/game-service/src/game/game.module.ts"
/*!***************************************************!*\
  !*** ./apps/game-service/src/game/game.module.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const game_gateway_1 = __webpack_require__(/*! ./game.gateway */ "./apps/game-service/src/game/game.gateway.ts");
const game_service_1 = __webpack_require__(/*! ./game.service */ "./apps/game-service/src/game/game.service.ts");
const shared_module_1 = __webpack_require__(/*! apps/game-service/src/shared/shared.module */ "./apps/game-service/src/shared/shared.module.ts");
const combat_service_1 = __webpack_require__(/*! ./combat.service */ "./apps/game-service/src/game/combat.service.ts");
const entity_module_1 = __webpack_require__(/*! ./entities/entity.module */ "./apps/game-service/src/game/entities/entity.module.ts");
const redis_service_1 = __webpack_require__(/*! ../redis/redis.service */ "./apps/game-service/src/redis/redis.service.ts");
const redis_state_service_1 = __webpack_require__(/*! ../redis/redis_state.service */ "./apps/game-service/src/redis/redis_state.service.ts");
const map_service_1 = __webpack_require__(/*! ./map.service */ "./apps/game-service/src/game/map.service.ts");
const ai_module_1 = __webpack_require__(/*! ./ai_service/ai.module */ "./apps/game-service/src/game/ai_service/ai.module.ts");
const player_module_1 = __webpack_require__(/*! ./player/player.module */ "./apps/game-service/src/game/player/player.module.ts");
const user_stats_client_service_1 = __webpack_require__(/*! ./user-stats-client.service */ "./apps/game-service/src/game/user-stats-client.service.ts");
const axios_1 = __webpack_require__(/*! @nestjs/axios */ "@nestjs/axios");
let GameModule = class GameModule {
};
exports.GameModule = GameModule;
exports.GameModule = GameModule = __decorate([
    (0, common_1.Module)({
        providers: [
            game_gateway_1.GameGateway,
            game_service_1.GameService,
            map_service_1.MapService,
            combat_service_1.CombatService,
            redis_service_1.RedisService,
            redis_state_service_1.RedisStateService,
            user_stats_client_service_1.UserStatsClientService,
        ],
        imports: [shared_module_1.SharedModule, entity_module_1.EntityModule, ai_module_1.AiModule, player_module_1.PlayerModule, axios_1.HttpModule],
    })
], GameModule);


/***/ },

/***/ "./apps/game-service/src/game/game.service.ts"
/*!****************************************************!*\
  !*** ./apps/game-service/src/game/game.service.ts ***!
  \****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const event_emitter_1 = __webpack_require__(/*! @nestjs/event-emitter */ "@nestjs/event-emitter");
const player_service_1 = __webpack_require__(/*! ./player/player.service */ "./apps/game-service/src/game/player/player.service.ts");
const map_service_1 = __webpack_require__(/*! ./map.service */ "./apps/game-service/src/game/map.service.ts");
const combat_service_1 = __webpack_require__(/*! ./combat.service */ "./apps/game-service/src/game/combat.service.ts");
const phase_timer_service_1 = __webpack_require__(/*! apps/game-service/src/shared/phase-timer.service */ "./apps/game-service/src/shared/phase-timer.service.ts");
const game_type_1 = __webpack_require__(/*! apps/game-service/src/game/game.type */ "./apps/game-service/src/game/game.type.ts");
const redis_service_1 = __webpack_require__(/*! ../redis/redis.service */ "./apps/game-service/src/redis/redis.service.ts");
const redis_state_service_1 = __webpack_require__(/*! ../redis/redis_state.service */ "./apps/game-service/src/redis/redis_state.service.ts");
const ai_orchestrator_service_1 = __webpack_require__(/*! ./ai_service/ai.orchestrator.service */ "./apps/game-service/src/game/ai_service/ai.orchestrator.service.ts");
const lobby_const_1 = __webpack_require__(/*! ../lobby/lobby.const */ "./apps/game-service/src/lobby/lobby.const.ts");
const user_stats_client_service_1 = __webpack_require__(/*! ./user-stats-client.service */ "./apps/game-service/src/game/user-stats-client.service.ts");
let GameService = class GameService {
    eventEmitter;
    phaseTimer;
    playerService;
    combatService;
    mapService;
    redisService;
    redisStateService;
    aiOrchestrator;
    userStatsClient;
    constructor(eventEmitter, phaseTimer, playerService, combatService, mapService, redisService, redisStateService, aiOrchestrator, userStatsClient) {
        this.eventEmitter = eventEmitter;
        this.phaseTimer = phaseTimer;
        this.playerService = playerService;
        this.combatService = combatService;
        this.mapService = mapService;
        this.redisService = redisService;
        this.redisStateService = redisStateService;
        this.aiOrchestrator = aiOrchestrator;
        this.userStatsClient = userStatsClient;
    }
    gameRooms = new Map();
    roomIdByPlayer = new Map();
    activePlayersByRoom = new Map();
    getRoomById(userId) {
        return this.roomIdByPlayer.get(userId);
    }
    async verifyRoomAccess(userId, roomId) {
        const [isActive, players, capacity] = await Promise.all([
            this.redisService.isInSet(lobby_const_1.LOBBY_KEYS.ACTIVE_ROOMS, roomId),
            this.redisService.getPlayersFromRoom(roomId),
            this.redisService.getRoomCapacity(roomId),
        ]);
        if (!isActive) {
            console.log(`[GameGateway]: Room ${roomId} not found or not active`);
            return null;
        }
        const player = players.find((p) => p.username === userId);
        if (!player) {
            console.log(`[GameGateway]: User ${userId} not authorized in room ${roomId}`);
            return null;
        }
        return { capacity, skin: player.skin };
    }
    joinGameRoom(roomId, userId) {
        let roomPlayers = this.gameRooms.get(roomId);
        if (!roomPlayers) {
            roomPlayers = new Set();
            this.gameRooms.set(roomId, roomPlayers);
        }
        roomPlayers.add(userId);
        return roomPlayers;
    }
    leaveGameRoom(roomId, userId) {
        const room = this.gameRooms.get(roomId);
        if (!room)
            return;
        room.delete(userId);
        if (room.size === 0) {
            this.gameRooms.delete(roomId);
        }
    }
    async onGodotConnected(userId, uID, roomId, access) {
        let roomPlayers = this.joinGameRoom(roomId, userId);
        this.roomIdByPlayer.set(userId, roomId);
        console.log(`Size = ${roomPlayers.size}, RoomId = ${roomId}`);
        this.playerService.initPlayer(userId, uID, access.skin);
        const player = this.playerService.getPlayer(userId);
        let activePlayers = this.activePlayersByRoom.get(roomId);
        if (!activePlayers) {
            activePlayers = new Set();
            this.activePlayersByRoom.set(roomId, activePlayers);
        }
        activePlayers.add(userId);
        const botIds = await this.redisService.getRoomBots(roomId);
        for (const botId of botIds) {
            if (roomPlayers.has(botId))
                continue;
            roomPlayers.add(botId);
            this.roomIdByPlayer.set(botId, roomId);
            activePlayers.add(botId);
        }
        console.log('Active Players at start: ', this.activePlayersByRoom);
        console.log('*********************************************');
        player.roundsRemaining = Math.log2(access.capacity);
        if (roomPlayers.size === access.capacity) {
            for (const uid of roomPlayers) {
                const playerState = this.playerService.getPlayer(uid);
                if (!playerState.isBot)
                    await this.redisStateService.updateStatePlayer(uid, playerState);
            }
            console.log('Gameroom', this.gameRooms.get(roomId));
            this.combatService.matchmake(roomPlayers);
            const resolvedPairs = this.resolveBotVsBotPairs(roomId, roomPlayers);
            const playersForMapPhase = resolvedPairs.size > 0
                ? new Set([...roomPlayers].filter((id) => !resolvedPairs.has(id)))
                : roomPlayers;
            this.startMapPhase(roomId, playersForMapPhase);
        }
    }
    async onGodotDisconnected(userId, roomId) {
        const room = this.gameRooms.get(roomId);
        if (!room || !room.has(userId))
            return;
        const player = this.playerService.getPlayer(userId);
        const tournamentOver = player?.status === 'winner' && player.roundsRemaining === 0;
        const stillInTheRunning = !!player && player.status !== 'loser' && !tournamentOver;
        if (stillInTheRunning) {
            const roomHasOtherHumans = this.hasHumanPlayers(roomId, userId);
            if (!roomHasOtherHumans) {
                console.log(`[GameService] No human players left in room ${roomId} -> deleting room instead of AI takeover`);
                await this.cleanupAbandonedRoom(roomId);
                return;
            }
            const opponentId = this.combatService.getOpponentId(userId);
            const enemy = opponentId ? this.playerService.getPlayer(opponentId) : undefined;
            const totalRounds = Math.log2(lobby_const_1.DEFAULT.CAPACITY);
            const round = totalRounds - player.roundsRemaining + 1;
            this.aiOrchestrator.takeoverPlayer(round, totalRounds, player);
            console.log(`[GameService] Player ${userId} disconnected while still in the running -> replaced by AI`);
            return;
        }
        if (!player?.isBot) {
            const playerState = await this.redisStateService.getStatePlayer(userId);
            if (playerState) {
                const monsterCatch = playerState.monsterCatch;
                const win = playerState.win;
                const lose = playerState.lose;
                const playerDefeated = playerState.playerDefeated;
                const asset = playerState.asset;
                console.log("monsterCatch: ", monsterCatch, "win: ", win, "lose: ", lose, "playerDefeated: ", playerDefeated, "asset: ", asset);
                await this.userStatsClient.allUpdate(playerState.uid, { monsterCatch, win, lose, playerDefeated, asset });
            }
            await this.redisStateService.removePlayer(userId);
        }
        this.leaveGameRoom(roomId, userId);
        this.activePlayersByRoom.get(roomId)?.delete(userId);
        this.roomIdByPlayer.delete(userId);
        this.playerService.removePlayer(userId);
        if (player)
            this.startNextRound(roomId);
        else {
            console.log('[GameService] onGodotDisconnected: AbortedGame cleaning');
            await this.deleteAbortedGame(roomId, userId);
        }
    }
    sendToPlayer(userId, payload) {
        this.eventEmitter.emit('send_to_player', { userId, payload });
    }
    async startNextRound(roomId) {
        const active = this.activePlayersByRoom.get(roomId);
        if (!active)
            return;
        const canPairEveryone = active.size >= 2 && active.size % 2 === 0;
        const allCombatsFinished = [...active].every((id) => this.playerService.getPlayer(id)?.duelFinished === true);
        if (allCombatsFinished && canPairEveryone) {
            console.log('Active Players allCombatsFinished && canPairEveryone: ', active);
            console.log('*********************************************');
            this.combatService.matchmake(active);
            this.startMapPhase(roomId, active, true);
        }
        else if (active.size === 1) {
            const winnerId = [...active][0];
            if (winnerId) {
                const player = this.playerService.getPlayer(winnerId);
                await this.deleteEndGame(roomId, winnerId);
            }
            console.log('Game rooms end game: ', this.gameRooms);
            return;
        }
    }
    async eliminatePlayer(userId, roomId) {
        console.log(`[GameService] Eliminating player ${userId} from room ${roomId}`);
        const player = this.playerService.getPlayer(userId);
        if (player?.isBot) {
            await this.onGodotDisconnected(userId, roomId);
            return;
        }
        this.eventEmitter.emit('close_player_socket', { userId });
    }
    async deleteAbortedGame(roomId, disconnectedUserId) {
        const remaining = this.gameRooms.get(roomId);
        const allInvolved = new Set(remaining ?? []);
        allInvolved.add(disconnectedUserId);
        for (const id of allInvolved) {
            const combatRoomId = this.combatService.playerCombatRoom.get(id);
            if (combatRoomId) {
                this.combatService.combatRooms.delete(combatRoomId);
                this.phaseTimer.clear(`combat: ${combatRoomId}`);
            }
            this.combatService.playerCombatRoom.delete(id);
            this.roomIdByPlayer.delete(id);
            if (id !== disconnectedUserId)
                this.eventEmitter.emit('close_player_socket', { userId: id });
            const player = this.playerService.getPlayer(id);
            console.log("ABORTED GAME");
            if (player && !player.isBot) {
                const playerState = await this.redisStateService.getStatePlayer(id);
                if (playerState) {
                    const monsterCatch = playerState.monsterCatch;
                    const win = playerState.win;
                    const lose = playerState.lose;
                    const playerDefeated = playerState.playerDefeated;
                    const asset = playerState.asset;
                    console.log("monsterCatch: ", monsterCatch, "win: ", win, "lose: ", lose, "playerDefeated: ", playerDefeated, "asset: ", asset);
                    await this.userStatsClient.allUpdate(playerState.uid, { monsterCatch, win, lose, playerDefeated, asset });
                }
                await this.redisStateService.removePlayer(id);
            }
        }
        this.combatService.playerCombatRoom.delete(disconnectedUserId);
        this.roomIdByPlayer.delete(disconnectedUserId);
        this.phaseTimer.clear(`game: ${roomId}`);
        this.gameRooms.delete(roomId);
        this.activePlayersByRoom.delete(roomId);
    }
    async deleteEndGame(roomId, winnerId) {
        this.phaseTimer.clear(`game: ${roomId}`);
        this.gameRooms.delete(roomId);
        this.activePlayersByRoom.delete(roomId);
        this.roomIdByPlayer.delete(winnerId);
        this.combatService.playerCombatRoom.delete(winnerId);
        console.log("ENDGAME");
        const playerState = await this.redisStateService.getStatePlayer(winnerId);
        if (playerState && !playerState.isBot) {
            if (playerState) {
                const monsterCatch = playerState.monsterCatch;
                const win = playerState.win;
                const lose = playerState.lose;
                const playerDefeated = playerState.playerDefeated;
                const asset = playerState.asset;
                console.log("monsterCatch: ", monsterCatch, "win: ", win, "lose: ", lose, "playerDefeated: ", playerDefeated, "asset: ", asset);
                await this.userStatsClient.allUpdate(playerState.uid, { monsterCatch, win, lose, playerDefeated, asset });
            }
            await this.redisStateService.removePlayer(winnerId);
        }
        Promise.all([
            this.redisStateService.removePlayer(winnerId),
            this.redisService.deleteRoom(roomId),
            this.redisService.removeActiveRoom(roomId),
        ]).catch((err) => console.log([`GameService] deleteRoom: failed cleaning of ${roomId}`]));
    }
    startMapPhase(roomId, roomPlayers, nextRound = false) {
        this.phaseTimer.start(`game: ${roomId}`, 'map', () => {
            console.log(`Room ${roomId} map phase timeout`);
            this.startTeamSetupPhase(roomId, roomPlayers);
        });
        const mapTimer = this.phaseTimer.startTimes.get(`game: ${roomId}`) + game_type_1.PHASE_DURATIONS.map;
        const payloads = [...roomPlayers].map((userId) => {
            const player = this.playerService.getPlayer(userId);
            player.timer = mapTimer;
            if (nextRound) {
                return { userId, payload: this.combatService.next_map(player) };
            }
            else
                return { userId, payload: this.mapService.start_game(player) };
        });
        payloads.forEach(({ userId, payload }) => this.sendToPlayer(userId, payload));
        console.log(`[GameService]: startMapPhase -> start_game sent to ${roomPlayers.size} players of ${roomId}`);
    }
    startTeamSetupPhase(roomId, roomPlayers) {
        this.phaseTimer.start(`game: ${roomId}`, 'team_setup', () => {
            console.log(`Room ${roomId} team_setup phase timeout`);
        });
        const teamSetupTimer = this.phaseTimer.startTimes.get(`game: ${roomId}`) +
            game_type_1.PHASE_DURATIONS.team_setup;
        for (const userId of roomPlayers) {
            const player = this.playerService.getPlayer(userId);
            player.timer = teamSetupTimer;
            player.teamReady = false;
            const opponentId = this.combatService.getOpponentId(userId);
            const enemy = opponentId
                ? this.playerService.getPlayer(opponentId)
                : undefined;
            if (!enemy) {
                console.log(`[GameService]: No opponent for ${userId} (room ${roomId}) - using player as placeholder`);
            }
            console.log('USER ID: ', userId);
            console.log('OPONNENT ID: ', opponentId);
            console.log('******************');
            this.sendToPlayer(userId, this.mapService.team_setup(player, enemy ?? player));
            if (player.isBot) {
                const chosenTeam = this.aiOrchestrator.decideBattleTeam(player, enemy ?? player);
                void this.handleMessage(userId, { state: 'team_choice', battle_team: chosenTeam });
            }
        }
    }
    startCombatPhase(roomId, roomPlayers) {
        const handled = new Set();
        for (const userId of roomPlayers) {
            if (handled.has(userId))
                continue;
            const opponentId = this.combatService.getOpponentId(userId);
            const combatRoomId = this.combatService.playerCombatRoom.get(userId);
            if (!combatRoomId) {
                console.log(`[GameService]: start CombatPhase -> missing combatRoomId for ${userId}`);
                continue;
            }
            const timerKey = `combat: ${combatRoomId}`;
            this.phaseTimer.start(timerKey, 'choose_action', () => {
                console.log(`Combat ${roomId} choose_action timeout`);
                this.actionTimeout(combatRoomId);
            });
            const combatTimer = this.phaseTimer.startTimes.get(timerKey) +
                game_type_1.PHASE_DURATIONS.choose_action;
            this.playerService.getPlayer(userId).timer = combatTimer;
            handled.add(userId);
            if (opponentId) {
                this.playerService.getPlayer(opponentId).timer = combatTimer;
                handled.add(opponentId);
            }
        }
        console.log('Combat timer started');
    }
    startNewTurn(combatRoomId, room) {
        const timerKey = combatRoomId ? `combat: ${combatRoomId}` : undefined;
        if (!combatRoomId) {
            console.log('[GameService] - StartNewTurn -> combatRoomId undefined');
            return;
        }
        if (!timerKey)
            return;
        this.phaseTimer.start(timerKey, 'choose_action', () => {
            console.log(`Room ${combatRoomId} choose_action timeout`);
            this.actionTimeout(combatRoomId);
        });
        const actionTimer = this.phaseTimer.startTimes.get(timerKey) + game_type_1.PHASE_DURATIONS.choose_action;
        for (const userId of room) {
            this.playerService.getPlayer(userId).timer = actionTimer;
        }
        console.log('New Turn timer started');
    }
    actionTimeout(combatRoomId) {
        const room = this.combatService.combatRooms.get(combatRoomId);
        if (!room) {
            console.log(`[GameService] actionTimeout -> unknow combat room ${combatRoomId}`);
            return;
        }
        const [userId, userId2] = room;
        const player = this.playerService.getPlayer(userId);
        const player2 = this.playerService.getPlayer(userId2);
        if (!player || !player2) {
            console.log(`[GameService]: actionTimeout -> missing player(s) for room ${combatRoomId}`);
            return;
        }
        const forcedMonster = player.forceChooseMonster || player2.forceChooseMonster;
        if (forcedMonster) {
            if (player.forceChooseMonster &&
                player.currentActions.actionType === undefined) {
                this.autoChooseMonster(userId, player);
            }
            if (player2.forceChooseMonster &&
                player2.currentActions.actionType === undefined) {
                this.autoChooseMonster(userId2, player2);
            }
        }
        else {
            if (player.currentActions.actionType === undefined) {
                if (this.needMonsterChoice(player))
                    this.autoChooseMonster(userId, player);
                else
                    this.autoPass(userId, player);
            }
            if (player2.currentActions.actionType === undefined) {
                if (this.needMonsterChoice(player2))
                    this.autoChooseMonster(userId2, player2);
                else
                    this.autoPass(userId2, player2);
            }
        }
        this.resolveTurn(player, player2);
    }
    needMonsterChoice(player) {
        return (player.currentMonster.name === '' ||
            player.currentMonster.life.current <= 0);
    }
    autoChooseMonster(userId, player) {
        if (player.currentActions.actionType !== undefined)
            return;
        console.log(`[GameService]: Auto-choose monster for player ${userId} (timeout)`);
        player.currentActions = {
            actionType: 'change_current_monster',
            data: { slot: -1, state: 'change_current_monster' },
        };
    }
    autoPass(userId, player) {
        if (player.currentActions.actionType !== undefined)
            return;
        console.log(`[GameService]: Auto-pass for player ${userId} (timeout)`);
        player.currentActions = {
            actionType: 'pass',
            data: { state: 'pass' },
        };
    }
    has_valid_monsters(player) {
        for (const monster of player.battle_team) {
            if (monster.name !== '' && monster.life.current > 0) {
                return true;
            }
        }
        return false;
    }
    async handleMessage(userId, payload) {
        const player = this.playerService.getPlayer(userId);
        const userId2 = this.combatService.getOpponentId(userId);
        const roomId = this.roomIdByPlayer.get(userId);
        const state = payload?.state;
        console.log('STATE', state);
        if (state === 'safe_to_continue') {
            if (player.status === 'winner' && player.roundsRemaining > 0) {
                player.duelFinished = true;
                await this.startNextRound(roomId);
                return;
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
            if (player.status === 'loser')
                await this.eliminatePlayer(player.id, roomId);
            if (player.status === 'winner' && player.roundsRemaining === 0)
                this.eventEmitter.emit('close_player_socket', { userId: player.id });
            return;
        }
        if (!userId2) {
            console.log(`[GameService]: userId2 for ${userId} is missing`);
            return;
        }
        const player2 = userId2 ? this.playerService.getPlayer(userId2) : undefined;
        if (!player2) {
            console.log(`[GameService]: No opponent for ${userId}`);
            return;
        }
        let result;
        switch (state) {
            case 'add_item':
                result = this.mapService.received_add_item(player);
                break;
            case 'delete_item':
                result = this.mapService.received_delete_item(player, payload.item);
                break;
            case 'item_request':
                result = await this.mapService.received_request_item(player);
                break;
            case 'use_item': {
                this.sendToPlayer(userId, this.mapService.received_delete_item(player, payload.item));
                result = this.mapService.received_use_item(player, payload.item);
                break;
            }
            case 'new_encounter':
                result = await this.mapService.received_new_encounter(player, payload.tile);
                break;
            case 'try_catch':
                result = this.mapService.received_try_catch(player);
                break;
            case 'delete_monster':
                result = this.mapService.received_delete_monster(player, payload.monster);
                break;
            case 'team_choice': {
                result = await this.resolveTeamChoice(player, player2, roomId, payload);
                break;
            }
            case 'change_current_monster':
            case 'use_item_combat':
            case 'try_attack':
            case 'pass':
                this.applyPlayerAction(player, payload);
                this.resolveTurn(player, player2);
                break;
            default:
                console.log('Unknow state:', state);
        }
        if (result)
            this.sendToPlayer(userId, result);
        const playerState = this.playerService.getPlayer(userId);
        if (playerState)
            await this.redisStateService.updateStatePlayer(userId, playerState);
    }
    async resolveTeamChoice(player, player2, roomId, payload) {
        let result;
        const error = await this.mapService.received_team_choice(player, payload.battle_team);
        if (error) {
            console.log('TEAM CHOICE PAYLOAD ERROR', error);
            result = error;
            return;
        }
        player.teamReady = true;
        if (player2.teamReady) {
            this.startCombatPhase(roomId, new Set([player.id, player2.id]));
            this.sendToPlayer(player.id, this.mapService.combat(player));
            this.sendToPlayer(player2.id, this.mapService.combat(player2));
            this.triggerBotCombatTurn(player.id, player, player2);
            this.triggerBotCombatTurn(player2.id, player2, player);
        }
        if (!result)
            result = { event: 'game', data: { state: 'waiting_for_opponent' } };
    }
    applyPlayerAction(player, payload) {
        player.currentActions = {
            actionType: payload.state,
            data: payload,
        };
    }
    resolveTurn(player, player2) {
        const combatRoomId = this.combatService.playerCombatRoom.get(player.id);
        if (!combatRoomId) {
            console.log(`[GameService]: Missing combat room at end of combat, userId=${player.id}`, player.id);
            return;
        }
        let playerForce = undefined;
        if (player.forceChooseMonster)
            playerForce = player;
        else if (player2?.forceChooseMonster)
            playerForce = player2;
        const bothPlayersActed = !!player.currentActions.actionType && !!player2.currentActions.actionType;
        if (!bothPlayersActed && !playerForce?.forceChooseMonster)
            return;
        const roundResolved = this.applyBattleRound(player, player2, player.id, player2.id);
        if (!roundResolved)
            return;
        let endOfBattle;
        if (player.currentMonster.life.current <= 0) {
            endOfBattle = this.resolveMonsterKO(player, player2, player, player2);
        }
        else if (player2.currentMonster.life.current <= 0) {
            endOfBattle = this.resolveMonsterKO(player, player2, player2, player);
        }
        else {
            endOfBattle = false;
            this.startNewTurn(combatRoomId, new Set([player.id, player2.id]));
            this.sendToPlayer(player.id, this.combatService.new_turn(player));
            this.sendToPlayer(player2.id, this.combatService.new_turn(player2));
            this.triggerBotCombatTurn(player.id, player, player2);
            this.triggerBotCombatTurn(player2.id, player2, player);
        }
        if (endOfBattle) {
            this.finalizeBattleEnd(player, player2, combatRoomId);
        }
    }
    applyBattleRound(player, player2, userId, userId2) {
        const mapResult = this.combatService.resolving_battle_round(player, player2);
        if (!mapResult ||
            mapResult.get(player.id) === undefined ||
            mapResult.get(player2.id) === undefined) {
            console.log('Waiting Player: ');
            return false;
        }
        const messagesForPlayer = mapResult.get(player.id);
        const messagesForPlayer2 = mapResult.get(player2.id);
        for (let i = 0; i < messagesForPlayer.length; ++i) {
            this.sendToPlayer(userId, messagesForPlayer.at(i));
            this.sendToPlayer(userId2, messagesForPlayer2.at(i));
        }
        player.currentActions.actionType = undefined;
        player2.currentActions.actionType = undefined;
        return true;
    }
    resolveMonsterKO(player, player2, koPlayer, otherPlayer) {
        if (!this.has_valid_monsters(koPlayer)) {
            koPlayer.status = 'loser';
            otherPlayer.status = 'winner';
            koPlayer.roundsRemaining -= 1;
            otherPlayer.roundsRemaining -= 1;
            this.sendToPlayer(player.id, this.combatService.result_battle(player, otherPlayer.id));
            this.sendToPlayer(player2.id, this.combatService.result_battle(player2, otherPlayer.id));
            const koUserId = koPlayer.id === player.id ? player.id : player2.id;
            this.triggerBotCombatTurn(koUserId, koPlayer, otherPlayer);
            return true;
        }
        koPlayer.forceChooseMonster = true;
        player.timer = -1;
        const combatRoomId = this.combatService.playerCombatRoom.get(player.id);
        if (combatRoomId) {
            this.startNewTurn(combatRoomId, new Set([player.id, player2.id]));
        }
        else {
            console.log(`[GameService]: resolveMonsterKO -> missing combatRoomIdfor ${player.id}`);
        }
        this.sendToPlayer(player.id, this.combatService.change_monster(player, koPlayer.id));
        this.sendToPlayer(player2.id, this.combatService.change_monster(player2, koPlayer.id));
        const koUserId = koPlayer.id === player.id ? player.id : player2.id;
        this.triggerBotCombatTurn(koUserId, koPlayer, otherPlayer);
        return false;
    }
    async finalizeBattleEnd(player, player2, combatRoomId) {
        const winner = player.status === 'loser' ? player2 : player;
        const loser = player.status === 'loser' ? player : player2;
        this.combatService.playerCombatRoom.delete(loser.id);
        this.combatService.playerCombatRoom.delete(winner.id);
        this.combatService.combatRooms.delete(combatRoomId);
        this.phaseTimer.clear(`combat: ${combatRoomId}`);
        this.clearPendingBotAction(winner.id);
        this.clearPendingBotAction(loser.id);
        if (winner.roundsRemaining === 0) {
            winner.win = true;
            this.sendToPlayer(winner.id, {
                event: 'game',
                data: { state: 'finish' },
            });
        }
        await this.redisStateService.updateStatePlayer(loser.id, loser);
        await this.redisStateService.updateStatePlayer(winner.id, winner);
        loser.duelFinished = true;
        if (winner.isBot)
            winner.duelFinished = true;
        if (loser.isBot) {
            const loserBotRoomId = this.roomIdByPlayer.get(loser.id);
            if (loserBotRoomId) {
                this.eliminatePlayer(loser.id, loserBotRoomId).catch((err) => console.log(`[GameService] eliminatePlayer (bot loser) failed for ${loser.id}`, err));
            }
        }
        winner.resetAfterRound();
    }
    pendingBotActions = new Map();
    resolveBotVsBotPairs(roomId, roomPlayers) {
        const handled = new Set();
        const resolved = new Set();
        for (const userId of roomPlayers) {
            if (handled.has(userId))
                continue;
            const player = this.playerService.getPlayer(userId);
            if (!player?.isBot)
                continue;
            const opponentId = this.combatService.getOpponentId(userId);
            if (!opponentId || !roomPlayers.has(opponentId))
                continue;
            const opponent = this.playerService.getPlayer(opponentId);
            if (!opponent?.isBot)
                continue;
            handled.add(userId);
            handled.add(opponentId);
            const winner = Math.random() < 0.5 ? player : opponent;
            const loser = winner === player ? opponent : player;
            console.log(`[GameService] Bot-vs-bot ${userId} vs ${opponentId} -> résolu instantanément, vainqueur: ${winner.id}`);
            winner.status = 'winner';
            loser.status = 'loser';
            winner.roundsRemaining -= 1;
            loser.roundsRemaining -= 1;
            winner.resetAfterRound();
            winner.duelFinished = true;
            const combatRoomId = this.combatService.playerCombatRoom.get(userId);
            if (combatRoomId) {
                this.combatService.combatRooms.delete(combatRoomId);
            }
            this.combatService.playerCombatRoom.delete(userId);
            this.combatService.playerCombatRoom.delete(opponentId);
            this.leaveGameRoom(roomId, loser.id);
            this.activePlayersByRoom.get(roomId)?.delete(loser.id);
            this.roomIdByPlayer.delete(loser.id);
            this.playerService.removePlayer(loser.id);
            this.redisStateService.removePlayer(loser.id);
            resolved.add(userId);
            resolved.add(opponentId);
        }
        return resolved;
    }
    hasHumanPlayers(roomId, excludingUserId) {
        const roomPlayers = this.gameRooms.get(roomId);
        if (!roomPlayers)
            return false;
        for (const id of roomPlayers) {
            if (id === excludingUserId)
                continue;
            const player = this.playerService.getPlayer(id);
            if (player && !player.isBot)
                return true;
        }
        return false;
    }
    async cleanupAbandonedRoom(roomId) {
        const roomPlayers = this.gameRooms.get(roomId);
        const userIds = roomPlayers ? [...roomPlayers] : [];
        this.phaseTimer.clear(`game: ${roomId}`);
        for (const id of userIds) {
            const combatRoomId = this.combatService.playerCombatRoom.get(id);
            if (combatRoomId) {
                this.phaseTimer.clear(`combat: ${combatRoomId}`);
                this.combatService.combatRooms.delete(combatRoomId);
            }
            this.combatService.playerCombatRoom.delete(id);
            this.clearPendingBotAction(id);
            await this.redisStateService.removePlayer(id.toString());
            this.playerService.removePlayer(id);
            this.roomIdByPlayer.delete(id);
        }
        this.gameRooms.delete(roomId);
        this.activePlayersByRoom.delete(roomId);
        await Promise.all([
            this.redisService.deleteRoom(roomId),
            this.redisService.removeActiveRoom(roomId),
        ]).catch((err) => console.log(`[GameService] cleanupAbandonedRoom: failed cleaning of ${roomId}`, err));
        console.log(`[GameService] Room ${roomId} abandoned (no human players left) -> deleted`);
    }
    clearPendingBotAction(userId) {
        const existing = this.pendingBotActions.get(userId);
        if (existing) {
            clearTimeout(existing);
            this.pendingBotActions.delete(userId);
        }
    }
    triggerBotCombatTurn(userId, player, enemy) {
        if (!player.isBot)
            return;
        this.clearPendingBotAction(userId);
        const timer = setTimeout(() => {
            this.pendingBotActions.delete(userId);
            const action = this.aiOrchestrator.decideCombatAction(player, enemy);
            void this.handleMessage(userId, action);
        }, 500);
        this.pendingBotActions.set(userId, timer);
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _a : Object, typeof (_b = typeof phase_timer_service_1.PhaseTimerService !== "undefined" && phase_timer_service_1.PhaseTimerService) === "function" ? _b : Object, typeof (_c = typeof player_service_1.PlayerService !== "undefined" && player_service_1.PlayerService) === "function" ? _c : Object, typeof (_d = typeof combat_service_1.CombatService !== "undefined" && combat_service_1.CombatService) === "function" ? _d : Object, typeof (_e = typeof map_service_1.MapService !== "undefined" && map_service_1.MapService) === "function" ? _e : Object, typeof (_f = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _f : Object, typeof (_g = typeof redis_state_service_1.RedisStateService !== "undefined" && redis_state_service_1.RedisStateService) === "function" ? _g : Object, typeof (_h = typeof ai_orchestrator_service_1.AiOrchestratorService !== "undefined" && ai_orchestrator_service_1.AiOrchestratorService) === "function" ? _h : Object, typeof (_j = typeof user_stats_client_service_1.UserStatsClientService !== "undefined" && user_stats_client_service_1.UserStatsClientService) === "function" ? _j : Object])
], GameService);


/***/ },

/***/ "./apps/game-service/src/game/game.type.ts"
/*!*************************************************!*\
  !*** ./apps/game-service/src/game/game.type.ts ***!
  \*************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PHASE_DURATIONS = void 0;
exports.PHASE_DURATIONS = {
    lobby: 10,
    map: 20,
    team_setup: 15,
    choose_action: 20,
};


/***/ },

/***/ "./apps/game-service/src/game/map.service.ts"
/*!***************************************************!*\
  !*** ./apps/game-service/src/game/map.service.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MapService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const monsters_service_1 = __webpack_require__(/*! ./entities/monsters.service */ "./apps/game-service/src/game/entities/monsters.service.ts");
const tiles_service_1 = __webpack_require__(/*! ./entities/tiles.service */ "./apps/game-service/src/game/entities/tiles.service.ts");
const items_service_1 = __webpack_require__(/*! ./entities/items.service */ "./apps/game-service/src/game/entities/items.service.ts");
let MapService = class MapService {
    monstersService;
    tilesService;
    itemsService;
    constructor(monstersService, tilesService, itemsService) {
        this.monstersService = monstersService;
        this.tilesService = tilesService;
        this.itemsService = itemsService;
    }
    async received_new_encounter(player, tile) {
        const table_encounter = {
            common: 100,
            uncommon: 20,
            rare: 7,
        };
        const tileObject = await this.tilesService.findOneByType(tile);
        if (!tileObject) {
            console.log('tileObject is undefined');
            return undefined;
        }
        const tileId = tileObject.id;
        let table_monster = await this.monstersService.findMonstersByTile(tileId);
        if (!table_monster) {
            console.log('table_monster is undefined');
            return undefined;
        }
        let result = Math.floor(Math.random() * 100);
        let rarity;
        if (result <= table_encounter.rare) {
            rarity = 'rare';
        }
        else if (result <= table_encounter.uncommon) {
            rarity = 'uncommon';
        }
        else {
            rarity = 'common';
        }
        let selected_monsters = [];
        for (let i = 0; i < table_monster.length; i++) {
            if (table_monster[i].rarity === rarity)
                selected_monsters.push(table_monster[i].name);
        }
        if (selected_monsters.length === 0) {
            console.log(`No monster of rarity ${rarity} found on tile ${tile}`);
            return undefined;
        }
        const selected_monster = selected_monsters[Math.floor(Math.random() * selected_monsters.length)];
        player.current_monster = selected_monster;
        player.current_monster_rarity = rarity;
        return this.new_encounter(player);
    }
    received_delete_monster(player, monster) {
        let count = 0;
        for (let i = 0; i < player.team.length; ++i) {
            if (player.team[i] !== '') {
                count++;
            }
        }
        if (count <= 1) {
            return this.update_team(player);
        }
        for (let i = 0; i < player.team.length; ++i) {
            if (player.team[i] === monster) {
                player.team[i] = '';
                break;
            }
        }
        return this.update_team(player);
    }
    received_try_catch(player, item) {
        const table_catch = {
            common: 70,
            uncommon: 40,
            rare: 15,
        };
        let result = 0;
        if (item === undefined)
            result = Math.floor(Math.random() * 100);
        let monsterCatch = 0;
        monsterCatch =
            table_catch[player.current_monster_rarity];
        if (monsterCatch !== undefined) {
            if (result <= monsterCatch) {
                for (let i = 0; i < player.team.length; ++i) {
                    if (player.team[i] === '') {
                        player.team[i] = player.current_monster;
                        return this.result_catch(player, 1);
                    }
                }
            }
            else
                return this.result_catch(player, 0);
        }
        else
            return this.result_catch(player, 0);
    }
    async received_team_choice(player, monsters) {
        const monstersToLoad = [];
        let count = 0;
        for (let i = 0; i < monsters.length; i++) {
            if (monsters[i] !== '') {
                count++;
            }
        }
        if (count === 0) {
            for (let i = 0; i < player.team.length && count <= 2; i++) {
                if (player.team[i] !== '') {
                    monstersToLoad.push({
                        name: player.team[i],
                        slot: count,
                    });
                    count++;
                }
            }
        }
        else {
            for (let i = 0; i < monsters.length && monstersToLoad.length < 3; i++) {
                for (let j = 0; j < player.team.length; j++) {
                    if (monsters[i] !== '' && monsters[i] === player.team[j]) {
                        monstersToLoad.push({
                            name: player.team[j],
                            slot: monstersToLoad.length,
                        });
                        break;
                    }
                }
            }
        }
        for (const { name, slot } of monstersToLoad) {
            const monster = await this.monstersService.findOneByName(name, {
                skills: true,
            });
            if (!monster)
                return {
                    event: 'game',
                    data: {
                        state: 'team_choice',
                        reason: 'invalid_monster',
                        monster: name,
                    },
                };
            player.battle_team[slot] = {
                name: monster.name,
                slot: slot,
                life: {
                    current: monster.hp_total,
                    max: monster.hp_total,
                },
                type: String(monster.type),
                attack: monster.attack,
                attack_spe: monster.attack_spe,
                defense: monster.defense,
                defense_spe: monster.defense_spe,
                speed: monster.speed,
                status: [],
                dodge: false,
                skill: monster.skills.slice(0, 4).map((skill) => ({
                    name: skill.name,
                    current: skill.power_point,
                    max: skill.power_point,
                    type: skill.type,
                    effect: skill.effect,
                    repetition: skill.repetition,
                    precision: skill.precision,
                    data: skill.data,
                    value: skill.value,
                })),
            };
        }
        return undefined;
    }
    async received_request_item(player) {
        const items = await this.itemsService.findAll();
        if (!items || items.length === 0) {
            console.log('[ERROR]: items is empty or undefined');
            return undefined;
        }
        const result = Math.floor(Math.random() * 100);
        let gap = Math.floor(100 / items.length);
        const step = gap;
        let i = 0;
        for (i; result > gap && i < items.length - 1; ++i)
            gap += step;
        player.current_item = items[i].name;
        let add = false;
        for (let i = 0; i < player.inventory.length; ++i) {
            if (player.inventory[i]['name'] === player.current_item) {
                player.inventory[i]['current'] += 1;
                add = true;
                break;
            }
        }
        if (add === false) {
            for (let j = 0; j < player.inventory.length; j++) {
                if (player.inventory[j]['name'] === '') {
                    player.inventory[j]['name'] = player.current_item;
                    player.inventory[j]['scene'] = items[i].scene;
                    player.inventory[j].type = items[i].type;
                    player.inventory[j]['current'] += 1;
                    player.inventory[j]['value'] = items[i].value;
                    player.inventory[j]['target'] = items[i].target;
                    break;
                }
            }
        }
        return this.new_current_item(player);
    }
    received_add_item(player) {
        player.current_item = '';
        return this.update_inventory(player);
    }
    received_use_item(player, item) {
        for (let i = 0; i < player.team.length; ++i) {
            if (player.team[i] === '') {
                player.team[i] = player.current_monster;
                break;
            }
        }
        return this.result_catch(player, 1);
    }
    start_game(player) {
        return {
            event: 'game',
            data: {
                state: 'start_game',
                player: {
                    id: player.id,
                    name: player.id,
                    asset: player.asset,
                    team: player.team,
                },
                timer: player.timer,
                current_map: 'map_01',
            },
        };
    }
    new_encounter(player) {
        return {
            event: 'game',
            data: {
                state: 'new_encounter',
                current_monster: player.current_monster,
            },
        };
    }
    result_catch(player, result, monsterFlee) {
        let success = 0;
        let msg = {
            event: 'game',
            data: {
                state: 'result_catch',
                success: '',
                player: {
                    team: result !== 0 ? player.team : undefined,
                },
            },
        };
        if (result == 1) {
            msg.data.success = 'ok';
            if (!player.monsterCatch.includes(player.current_monster))
                player.monsterCatch.push(player.current_monster);
            return msg;
        }
        else {
            let flee = Math.floor(Math.random() * 101);
            if (flee < 50)
                msg.data.success = 'flee';
            else
                msg.data.success = 'fail';
            return msg;
        }
    }
    update_inventory(player) {
        return {
            event: 'game',
            data: {
                state: 'update_inventory',
                player: {
                    inventory: player.inventory,
                },
            },
        };
    }
    new_current_item(player) {
        return {
            event: 'game',
            data: {
                state: 'new_current_item',
                current_item: player.current_item,
            },
        };
    }
    received_delete_item(player, item) {
        for (let i = 0; i < player.inventory.length; ++i) {
            if (player.inventory[i]['name'] === item) {
                if (player.inventory[i].current === 1) {
                    player.inventory[i]['name'] = '';
                    player.inventory[i]['scene'] = '';
                    player.inventory[i]['type'] = '';
                    player.inventory[i]['target'] = '';
                    player.inventory[i]['value'] = 0;
                    player.inventory[i]['current'] = 0;
                }
                else {
                    player.inventory[i].current -= 1;
                }
                break;
            }
        }
        return this.update_inventory(player);
    }
    update_team(player) {
        return {
            event: 'game',
            data: {
                state: 'update_team',
                player: {
                    team: player.team,
                },
            },
        };
    }
    team_setup(player, enemy) {
        return {
            event: 'game',
            data: {
                state: 'team_setup',
                timer: player.timer,
                player: {
                    team: player.team,
                },
                enemy: {
                    id: enemy.id,
                    name: enemy.name,
                    asset: enemy.asset,
                    team: enemy.team,
                },
            },
        };
    }
    combat(player) {
        return {
            event: 'game',
            data: {
                state: 'combat',
                timer: player.timer,
                player: {
                    battle_team: player.battle_team,
                },
            },
        };
    }
};
exports.MapService = MapService;
exports.MapService = MapService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof monsters_service_1.MonstersService !== "undefined" && monsters_service_1.MonstersService) === "function" ? _a : Object, typeof (_b = typeof tiles_service_1.TilesService !== "undefined" && tiles_service_1.TilesService) === "function" ? _b : Object, typeof (_c = typeof items_service_1.ItemsService !== "undefined" && items_service_1.ItemsService) === "function" ? _c : Object])
], MapService);


/***/ },

/***/ "./apps/game-service/src/game/player/player.interfaces.ts"
/*!****************************************************************!*\
  !*** ./apps/game-service/src/game/player/player.interfaces.ts ***!
  \****************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.emptyCurrentMonster = emptyCurrentMonster;
function emptyCurrentMonster() {
    return {
        name: '',
        slot: -1,
        life: { current: 0, max: 0 },
        type: '',
        attack: 0,
        attack_spe: 0,
        defense: 0,
        defense_spe: 0,
        speed: 0,
        status: [],
        dodge: false,
        skill: [],
    };
}


/***/ },

/***/ "./apps/game-service/src/game/player/player.module.ts"
/*!************************************************************!*\
  !*** ./apps/game-service/src/game/player/player.module.ts ***!
  \************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const player_service_1 = __webpack_require__(/*! ./player.service */ "./apps/game-service/src/game/player/player.service.ts");
let PlayerModule = class PlayerModule {
};
exports.PlayerModule = PlayerModule;
exports.PlayerModule = PlayerModule = __decorate([
    (0, common_1.Module)({
        providers: [player_service_1.PlayerService],
        exports: [player_service_1.PlayerService],
    })
], PlayerModule);


/***/ },

/***/ "./apps/game-service/src/game/player/player.service.ts"
/*!*************************************************************!*\
  !*** ./apps/game-service/src/game/player/player.service.ts ***!
  \*************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const player_1 = __webpack_require__(/*! ./player */ "./apps/game-service/src/game/player/player.ts");
let PlayerService = class PlayerService {
    players = new Map();
    idsByPlayers = new Map();
    initPlayer(userId, uID, skin) {
        console.log("SKIN: ", skin);
        const player = new player_1.Player(userId, userId, uID, skin);
        this.players.set(userId, player);
        this.idsByPlayers.set(player, userId);
    }
    injectPlayer(userId, player) {
        this.players.set(userId, player);
    }
    getPlayer(userId) {
        return this.players.get(userId);
    }
    getUserId(player) {
        const id = this.idsByPlayers.get(player);
        return id;
    }
    removePlayer(userId) {
        const player = this.players.get(userId);
        this.players.delete(userId);
        this.idsByPlayers.delete(player);
    }
};
exports.PlayerService = PlayerService;
exports.PlayerService = PlayerService = __decorate([
    (0, common_1.Injectable)()
], PlayerService);


/***/ },

/***/ "./apps/game-service/src/game/player/player.ts"
/*!*****************************************************!*\
  !*** ./apps/game-service/src/game/player/player.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Player = void 0;
const player_interfaces_1 = __webpack_require__(/*! ./player.interfaces */ "./apps/game-service/src/game/player/player.interfaces.ts");
class Player {
    id = '';
    name = '';
    uid = '';
    asset = '';
    isBot = false;
    currentMonster = {
        name: '',
        slot: -1,
        life: {
            current: 0,
            max: 0,
        },
        type: '',
        attack: 0,
        attack_spe: 0,
        defense: 0,
        defense_spe: 0,
        speed: 0,
        status: [],
        dodge: false,
        skill: [
            {
                name: '',
                current: 0,
                max: 0,
                type: '',
                effect: '',
                repetition: 0,
                precision: 0,
                data: '',
                value: 0,
            },
            {
                name: '',
                current: 0,
                max: 0,
                type: '',
                effect: '',
                repetition: 0,
                precision: 0,
                data: '',
                value: 0,
            },
            {
                name: '',
                current: 0,
                max: 0,
                type: '',
                effect: '',
                repetition: 0,
                precision: 0,
                data: '',
                value: 0,
            },
            {
                name: '',
                current: 0,
                max: 0,
                type: '',
                effect: '',
                repetition: 0,
                precision: 0,
                data: '',
                value: 0,
            },
        ],
    };
    battle_team = [
        {
            name: '',
            slot: -1,
            life: {
                current: 0,
                max: 0,
            },
            type: '',
            attack: 0,
            attack_spe: 0,
            defense: 0,
            defense_spe: 0,
            speed: 0,
            status: [],
            dodge: false,
            skill: [
                {
                    name: '',
                    current: 0,
                    max: 0,
                    type: '',
                    effect: '',
                    repetition: 0,
                    precision: 0,
                    data: '',
                    value: 0,
                },
                {
                    name: '',
                    current: 0,
                    max: 0,
                    type: '',
                    effect: '',
                    repetition: 0,
                    precision: 0,
                    data: '',
                    value: 0,
                },
                {
                    name: '',
                    current: 0,
                    max: 0,
                    type: '',
                    effect: '',
                    repetition: 0,
                    precision: 0,
                    data: '',
                    value: 0,
                },
                {
                    name: '',
                    current: 0,
                    max: 0,
                    type: '',
                    effect: '',
                    repetition: 0,
                    precision: 0,
                    data: '',
                    value: 0,
                },
            ],
        },
        {
            name: '',
            slot: -1,
            life: {
                current: 0,
                max: 0,
            },
            type: '',
            attack: 0,
            attack_spe: 0,
            defense: 0,
            defense_spe: 0,
            speed: 0,
            status: [],
            dodge: false,
            skill: [
                {
                    name: '',
                    current: 0,
                    max: 0,
                    type: '',
                    effect: '',
                    repetition: 0,
                    precision: 0,
                    data: '',
                    value: 0,
                },
                {
                    name: '',
                    current: 0,
                    max: 0,
                    type: '',
                    effect: '',
                    repetition: 0,
                    precision: 0,
                    data: '',
                    value: 0,
                },
                {
                    name: '',
                    current: 0,
                    max: 0,
                    type: '',
                    effect: '',
                    repetition: 0,
                    precision: 0,
                    data: '',
                    value: 0,
                },
                {
                    name: '',
                    current: 0,
                    max: 0,
                    type: '',
                    effect: '',
                    repetition: 0,
                    precision: 0,
                    data: '',
                    value: 0,
                },
            ],
        },
        {
            name: '',
            slot: -1,
            life: {
                current: 0,
                max: 0,
            },
            type: '',
            attack: 0,
            attack_spe: 0,
            defense: 0,
            defense_spe: 0,
            speed: 0,
            status: [],
            dodge: false,
            skill: [
                {
                    name: '',
                    current: 0,
                    max: 0,
                    type: '',
                    effect: '',
                    repetition: 0,
                    precision: 0,
                    data: '',
                    value: 0,
                },
                {
                    name: '',
                    current: 0,
                    max: 0,
                    type: '',
                    effect: '',
                    repetition: 0,
                    precision: 0,
                    data: '',
                    value: 0,
                },
                {
                    name: '',
                    current: 0,
                    max: 0,
                    type: '',
                    effect: '',
                    repetition: 0,
                    precision: 0,
                    data: '',
                    value: 0,
                },
                {
                    name: '',
                    current: 0,
                    max: 0,
                    type: '',
                    effect: '',
                    repetition: 0,
                    precision: 0,
                    data: '',
                    value: 0,
                },
            ],
        },
    ];
    team = ['pisciner', 'gigantomakia', 'burpy', '', '', ''];
    inventory = [
        {
            name: '',
            scene: '',
            current: 0,
            value: 0,
            type: '',
            target: '',
        },
        {
            name: '',
            scene: '',
            current: 0,
            value: 0,
            type: '',
            target: '',
        },
        {
            name: '',
            scene: '',
            current: 0,
            value: 0,
            type: '',
            target: '',
        },
        {
            name: '',
            scene: '',
            current: 0,
            value: 0,
            type: '',
            target: '',
        },
    ];
    currentActions = {
        actionType: undefined,
        data: undefined,
    };
    roundsRemaining = 0;
    status = 'default';
    teamReady = false;
    forceChooseMonster = false;
    duelFinished = false;
    timer = 0;
    current_map = '';
    current_monster = '';
    current_monster_rarity = '';
    current_item = '';
    text = '';
    monsterCatch = [];
    playerDefeated = 0;
    win = false;
    lose = false;
    constructor(new_id, name, uid, asset) {
        this.id = new_id;
        this.name = name;
        this.uid = uid;
        this.asset = asset;
        this.team[0] = 'pisciner';
    }
    resetAfterRound() {
        this.forceChooseMonster = false;
        this.duelFinished = false;
        this.currentActions.actionType = undefined;
        this.currentActions.data = '';
        this.text = '';
        this.battle_team = [];
        this.currentMonster = (0, player_interfaces_1.emptyCurrentMonster)();
    }
}
exports.Player = Player;


/***/ },

/***/ "./apps/game-service/src/game/state_player.const.ts"
/*!**********************************************************!*\
  !*** ./apps/game-service/src/game/state_player.const.ts ***!
  \**********************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.STATE_PLAYER = void 0;
exports.STATE_PLAYER = {
    player: (playerid) => `game:statePlayer:playerId:${playerid}`,
    state: (playerid) => `game:statePlayer:playerId:${playerid}:state`,
};


/***/ },

/***/ "./apps/game-service/src/game/user-stats-client.service.ts"
/*!*****************************************************************!*\
  !*** ./apps/game-service/src/game/user-stats-client.service.ts ***!
  \*****************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UserStatsClientService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserStatsClientService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const axios_1 = __webpack_require__(/*! @nestjs/axios */ "@nestjs/axios");
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
let UserStatsClientService = UserStatsClientService_1 = class UserStatsClientService {
    httpService;
    logger = new common_1.Logger(UserStatsClientService_1.name);
    baseUrl = process.env.USERS_SERVICE_URL ?? 'http://users_service:3000';
    constructor(httpService) {
        this.httpService = httpService;
    }
    async allUpdate(userId, payload) {
        try {
            await (0, rxjs_1.firstValueFrom)(this.httpService.patch(`${this.baseUrl}/stats/${userId}`, payload));
        }
        catch (err) {
            this.logger.error(`Failed to update stats for user ${userId}`, err);
        }
    }
};
exports.UserStatsClientService = UserStatsClientService;
exports.UserStatsClientService = UserStatsClientService = UserStatsClientService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _a : Object])
], UserStatsClientService);


/***/ },

/***/ "./apps/game-service/src/lobby/lobby.const.ts"
/*!****************************************************!*\
  !*** ./apps/game-service/src/lobby/lobby.const.ts ***!
  \****************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ROOM_IDS = exports.LOBBY_KEYS = exports.DEFAULT = void 0;
exports.DEFAULT = {
    COUNTDOWN: 30,
    CAPACITY: 4,
};
exports.LOBBY_KEYS = {
    USED_IDS: 'lobby:rooms:ids:used',
    FREE_IDS: 'lobby:rooms:ids:free',
    ACTIVE_ROOMS: 'lobby:rooms:active',
    INACTIVE_ROOMS: 'lobby:rooms:inactive',
    ROOM_PLAYERS: (roomId) => `room:${roomId}:players`,
    ROOM_CAPACITY: (roomId) => `room:${roomId}:capacity`,
    ROOM_TIMER: (roomId) => `room:${roomId}:timer`,
    ROOM_BOTS: (roomId) => `room:${roomId}:bots`,
};
exports.ROOM_IDS = [
    'Alpha Staging',
    'Assembly Point',
    'Ball Pit',
    'Briefing Room',
    'Campfire Rest',
    'Coffee Break',
    'Decontamination Chamber',
    'Deployment Zone',
    'Docking Bay',
    'Drop Zone',
    'Hall of Heroes',
    'Hyper-Drive Bay',
    'Last Stop',
    "Legends' Rest",
    'Lobby Level',
    'Matrix Node',
    'Orbital Lounge',
    'Pixel Lounge',
    'Quantum Hub',
    'Quarantine Zone',
    'Sector 0',
    'Shadow Annex',
    'Stasis Chamber',
    "Survivor's Refuge",
    'The Abyss',
    "The Adventurer's Guild",
    'The Armory',
    'The Bridge',
    'The Bunker',
    'The Chill Zone',
    'The Citadel Gate',
    'The Core',
    'The Echo Chamber',
    'The Green Room',
    'The Hangout',
    'The Limbo',
    'The Playground',
    'The Purgatory',
    'The Round Table',
    'The Sanctuary',
    'The Sideline',
    'The Staging Area',
    'The Tavern',
    'The Terminal',
    'The Waiting Room',
    'Transit Station',
    'Vault 101',
    'War Room',
    "Wayfarer's Haven",
    'Whispering Keep',
    'The Silence of the Lambs',
    'First',
    'Endless',
];


/***/ },

/***/ "./apps/game-service/src/lobby/lobby.controller.ts"
/*!*********************************************************!*\
  !*** ./apps/game-service/src/lobby/lobby.controller.ts ***!
  \*********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LobbyController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const redis_service_1 = __webpack_require__(/*! ../redis/redis.service */ "./apps/game-service/src/redis/redis.service.ts");
const jwt_http_guard_1 = __webpack_require__(/*! libs/shared/src/auth/guards/jwt-http.guard */ "./libs/shared/src/auth/guards/jwt-http.guard.ts");
let LobbyController = class LobbyController {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    async getRooms() {
        const [active_rooms, inactive_rooms] = await Promise.all([
            this.redis.getActiveRooms(),
            this.redis.getInactiveRooms(),
        ]);
        const activeRoomsPromises = active_rooms.map(async (roomId) => ({
            roomId,
            status: 'Ongoing',
            nb_player: await this.redis.countPlayersInRoom(roomId),
        }));
        const inactiveRoomsPromises = inactive_rooms.map(async (roomId) => ({
            roomId,
            status: 'Waiting for players',
            nb_player: await this.redis.countPlayersInRoom(roomId),
        }));
        const rooms = await Promise.all([
            ...inactiveRoomsPromises,
            ...activeRoomsPromises,
        ]);
        return { rooms };
    }
};
exports.LobbyController = LobbyController;
__decorate([
    (0, common_1.Get)('get_rooms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LobbyController.prototype, "getRooms", null);
exports.LobbyController = LobbyController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_http_guard_1.JwtHttpGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _a : Object])
], LobbyController);


/***/ },

/***/ "./apps/game-service/src/lobby/lobby.gateway.ts"
/*!******************************************************!*\
  !*** ./apps/game-service/src/lobby/lobby.gateway.ts ***!
  \******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LobbyGateway = void 0;
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const ws_1 = __webpack_require__(/*! ws */ "ws");
const event_emitter_1 = __webpack_require__(/*! @nestjs/event-emitter */ "@nestjs/event-emitter");
const clients_map_1 = __webpack_require__(/*! apps/game-service/src/shared/clients.map */ "./apps/game-service/src/shared/clients.map.ts");
const lobby_service_1 = __webpack_require__(/*! apps/game-service/src/lobby/lobby.service */ "./apps/game-service/src/lobby/lobby.service.ts");
const room_service_1 = __webpack_require__(/*! apps/game-service/src/shared/room.service */ "./apps/game-service/src/shared/room.service.ts");
const redis_service_1 = __webpack_require__(/*! ../redis/redis.service */ "./apps/game-service/src/redis/redis.service.ts");
const shared_auth_service_1 = __webpack_require__(/*! libs/shared/src/auth/shared-auth.service */ "./libs/shared/src/auth/shared-auth.service.ts");
let LobbyGateway = class LobbyGateway {
    lobbyService;
    roomService;
    redisService;
    wsAuthService;
    server;
    constructor(lobbyService, roomService, redisService, wsAuthService) {
        this.lobbyService = lobbyService;
        this.roomService = roomService;
        this.redisService = redisService;
        this.wsAuthService = wsAuthService;
    }
    async handleConnection(client, request) {
        try {
            const user = await this.wsAuthService.verifyWsHandshake(request);
            console.log(user);
            clients_map_1.clientsMap.set(client, { userId: user.id, isAlive: true });
            console.log('[LobbyGateway]: Client connected');
        }
        catch {
            client.close(4001, 'Unauthorized');
        }
    }
    handleDisconnect(client) {
        const clientData = clients_map_1.clientsMap.get(client);
        const userId = clientData?.userId.toString();
        if (clientData?.roomId && userId) {
            void this.notifyRoomOnLeave(client, clientData.roomId, userId);
            console.log('LEAVEROOM');
        }
        clients_map_1.clientsMap.delete(client);
        console.log('[LobbyGateway]: Client disconnected');
    }
    async notifyRoomOnLeave(client, roomId, userId) {
        const remainingClients = await this.roomService.leaveRoom(client, roomId, userId);
        if (remainingClients) {
            await this.lobbyService.handlePlayerLeave(roomId, remainingClients);
        }
    }
    broadcast(clients, message) {
        clients.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN)
                client.send(JSON.stringify(message));
        });
    }
    async handleCreateRoom(client, payload) {
        const clientData = clients_map_1.clientsMap.get(client);
        if (!clientData) {
            client.close();
            return;
        }
        await this.lobbyService.createRoomAndJoin(client, clientData.userId, payload.username, payload.skin);
    }
    async handleQuickPairing(client, payload) {
        const clientData = clients_map_1.clientsMap.get(client);
        if (!clientData) {
            client.close();
            return;
        }
        await this.lobbyService.quickPairing(client, clientData.userId, payload.username, payload.skin);
    }
    async handleJoinRoom(client, payload) {
        const clientData = clients_map_1.clientsMap.get(client);
        if (!clientData) {
            client.close();
            return;
        }
        await this.lobbyService.joinRoom(client, clientData.userId, payload.roomId, payload.username, payload.skin);
    }
    async onPlayerJoined({ clients, roomId, playerCount, }) {
        const timer = await this.redisService.getRoomTimer(roomId);
        const roomCapacity = await this.redisService.getRoomCapacity(roomId);
        const players = await this.redisService.getPlayersFromRoom(roomId);
        this.broadcast(clients, {
            event: 'lobby',
            state: 'player_joined',
            data: { roomId, playerCount, roomCapacity, timer, players },
        });
    }
    onStart({ roomId, clients, }) {
        this.startGame(roomId, clients);
    }
    startGame(roomId, clients) {
        this.broadcast(clients, {
            event: 'game',
            state: 'start_game',
            data: {
                roomId: roomId,
            },
        });
    }
};
exports.LobbyGateway = LobbyGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_e = typeof ws_1.Server !== "undefined" && ws_1.Server) === "function" ? _e : Object)
], LobbyGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('create_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof ws_1.WebSocket !== "undefined" && ws_1.WebSocket) === "function" ? _f : Object, Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], LobbyGateway.prototype, "handleCreateRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('quick_pairing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof ws_1.WebSocket !== "undefined" && ws_1.WebSocket) === "function" ? _h : Object, Object]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], LobbyGateway.prototype, "handleQuickPairing", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof ws_1.WebSocket !== "undefined" && ws_1.WebSocket) === "function" ? _k : Object, Object]),
    __metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], LobbyGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, event_emitter_1.OnEvent)('lobby.player_joined'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], LobbyGateway.prototype, "onPlayerJoined", null);
__decorate([
    (0, event_emitter_1.OnEvent)('lobby.start'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LobbyGateway.prototype, "onStart", null);
exports.LobbyGateway = LobbyGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(8081, { cors: { origin: true }, path: '/lobby' }),
    __metadata("design:paramtypes", [typeof (_a = typeof lobby_service_1.LobbyService !== "undefined" && lobby_service_1.LobbyService) === "function" ? _a : Object, typeof (_b = typeof room_service_1.RoomService !== "undefined" && room_service_1.RoomService) === "function" ? _b : Object, typeof (_c = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _c : Object, typeof (_d = typeof shared_auth_service_1.SharedAuthService !== "undefined" && shared_auth_service_1.SharedAuthService) === "function" ? _d : Object])
], LobbyGateway);


/***/ },

/***/ "./apps/game-service/src/lobby/lobby.module.ts"
/*!*****************************************************!*\
  !*** ./apps/game-service/src/lobby/lobby.module.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LobbyModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const lobby_gateway_1 = __webpack_require__(/*! ./lobby.gateway */ "./apps/game-service/src/lobby/lobby.gateway.ts");
const shared_module_1 = __webpack_require__(/*! apps/game-service/src/shared/shared.module */ "./apps/game-service/src/shared/shared.module.ts");
const lobby_service_1 = __webpack_require__(/*! ./lobby.service */ "./apps/game-service/src/lobby/lobby.service.ts");
const redis_service_1 = __webpack_require__(/*! ../redis/redis.service */ "./apps/game-service/src/redis/redis.service.ts");
const shared_auth_module_1 = __webpack_require__(/*! libs/shared/src/auth/shared-auth.module */ "./libs/shared/src/auth/shared-auth.module.ts");
const ai_module_1 = __webpack_require__(/*! ../game/ai_service/ai.module */ "./apps/game-service/src/game/ai_service/ai.module.ts");
const player_module_1 = __webpack_require__(/*! ../game/player/player.module */ "./apps/game-service/src/game/player/player.module.ts");
let LobbyModule = class LobbyModule {
};
exports.LobbyModule = LobbyModule;
exports.LobbyModule = LobbyModule = __decorate([
    (0, common_1.Module)({
        providers: [lobby_gateway_1.LobbyGateway, lobby_service_1.LobbyService, redis_service_1.RedisService],
        imports: [shared_module_1.SharedModule, shared_auth_module_1.SharedJwtModule, ai_module_1.AiModule, player_module_1.PlayerModule],
    })
], LobbyModule);


/***/ },

/***/ "./apps/game-service/src/lobby/lobby.service.ts"
/*!******************************************************!*\
  !*** ./apps/game-service/src/lobby/lobby.service.ts ***!
  \******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LobbyService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const event_emitter_1 = __webpack_require__(/*! @nestjs/event-emitter */ "@nestjs/event-emitter");
const ws_1 = __webpack_require__(/*! ws */ "ws");
const phase_timer_service_1 = __webpack_require__(/*! apps/game-service/src/shared/phase-timer.service */ "./apps/game-service/src/shared/phase-timer.service.ts");
const room_service_1 = __webpack_require__(/*! apps/game-service/src/shared/room.service */ "./apps/game-service/src/shared/room.service.ts");
const redis_service_1 = __webpack_require__(/*! ../redis/redis.service */ "./apps/game-service/src/redis/redis.service.ts");
const lobby_const_1 = __webpack_require__(/*! ./lobby.const */ "./apps/game-service/src/lobby/lobby.const.ts");
const ai_orchestrator_service_1 = __webpack_require__(/*! ../game/ai_service/ai.orchestrator.service */ "./apps/game-service/src/game/ai_service/ai.orchestrator.service.ts");
const player_service_1 = __webpack_require__(/*! ../game/player/player.service */ "./apps/game-service/src/game/player/player.service.ts");
let LobbyService = class LobbyService {
    roomService;
    eventEmitter;
    redisService;
    phaseTimer;
    aiOrchestrator;
    playerService;
    constructor(roomService, eventEmitter, redisService, phaseTimer, aiOrchestrator, playerService) {
        this.roomService = roomService;
        this.eventEmitter = eventEmitter;
        this.redisService = redisService;
        this.phaseTimer = phaseTimer;
        this.aiOrchestrator = aiOrchestrator;
        this.playerService = playerService;
    }
    async onApplicationBootstrap() {
        await this.redisService.addToSet(lobby_const_1.LOBBY_KEYS.FREE_IDS, lobby_const_1.ROOM_IDS);
    }
    async createRoomAndJoin(client, userSub, username, skin) {
        const roomId = await this.roomService.createRoom(lobby_const_1.DEFAULT.CAPACITY);
        await this.assignClientToRoom(client, userSub, roomId, username, skin);
    }
    async quickPairing(client, userSub, username, skin) {
        const roomId = this.roomService.findAvailableRoom() ??
            (await this.roomService.createRoom(lobby_const_1.DEFAULT.CAPACITY));
        await this.assignClientToRoom(client, userSub, roomId, username, skin);
    }
    async joinRoom(client, userSub, roomId, username, skin) {
        await this.assignClientToRoom(client, userSub, roomId, username, skin);
    }
    async assignClientToRoom(client, userSub, roomId, username, skin) {
        const capacity = this.roomService.getRoomCapacity(roomId);
        const size = this.roomService.getRoomSize(roomId);
        const isActive = this.roomService.isRoomActive(roomId);
        if (capacity === undefined ||
            size === undefined ||
            size >= capacity ||
            isActive) {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(JSON.stringify({
                    event: 'lobby',
                    state: 'join_failed',
                    data: {
                        roomId,
                        reason: capacity === undefined
                            ? 'not_found'
                            : isActive
                                ? 'already_started'
                                : 'full',
                    },
                }));
            }
            return;
        }
        await this.roomService.joinRoom(client, roomId);
        const evictedBotId = await this.redisService.popRoomBot(roomId);
        if (evictedBotId) {
            await this.evictBot(roomId, evictedBotId);
        }
        await this.redisService.addPlayerToRoom(userSub.toString(), roomId, username, skin);
        const clients = this.roomService.getClients(roomId);
        const roomCapacity = this.roomService.getRoomCapacity(roomId);
        console.log(`[LobbyService] User ${userSub} joined room ${roomId} (${clients.size}/${roomCapacity})`);
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(JSON.stringify({
                event: 'lobby',
                state: 'room_assigned',
                data: { roomId },
            }));
        }
        this.eventEmitter.emit('lobby.player_joined', {
            clients,
            roomId,
            playerCount: clients.size,
        });
        if (clients.size === roomCapacity) {
            this.phaseTimer.clear(`lobby:${roomId}`);
            this.roomService.markRoomActive(roomId);
            await this.redisService.markRoomActive(roomId);
            this.eventEmitter.emit('lobby.start', { roomId, clients });
        }
        else if (clients.size === 1) {
            await this.redisService.setRoomTimer(roomId);
            await this.fillRemainingWithBots(roomId, roomCapacity - clients.size, clients);
            this.phaseTimer.start(`lobby:${roomId}`, 'lobby', () => {
                console.log(`[LobbyService] Room ${roomId} lobby timeout`);
                void this.confirmRoomStart(roomId, clients);
            });
        }
    }
    async fillRemainingWithBots(roomId, missing, clients) {
        if (missing <= 0)
            return;
        await this.spawnAndRegisterBots(roomId, missing);
        const capacity = this.roomService.getRoomCapacity(roomId);
        this.eventEmitter.emit('lobby.player_joined', {
            clients,
            roomId,
            playerCount: capacity,
        });
    }
    async evictBot(roomId, botId) {
        await this.redisService.removePlayerFromRoom(botId, roomId);
        this.playerService.removePlayer(botId);
        console.log(`[LobbyService] Bot ${botId} évincé de la room ${roomId} (remplacé par un vrai joueur)`);
    }
    async confirmRoomStart(roomId, clients) {
        this.roomService.markRoomActive(roomId);
        await this.redisService.markRoomActive(roomId);
        this.eventEmitter.emit('lobby.start', { roomId, clients });
    }
    async spawnAndRegisterBots(roomId, count) {
        if (count <= 0)
            return;
        const capacity = this.roomService.getRoomCapacity(roomId);
        if (capacity === undefined)
            return;
        const currentCount = await this.redisService.countPlayersInRoom(roomId);
        const toSpawn = Math.max(0, Math.min(count, capacity - currentCount));
        if (toSpawn <= 0) {
            console.log(`[LobbyService] Room ${roomId} déjà à capacité (${currentCount}/${capacity}), aucun bot ajouté`);
            return;
        }
        const totalRounds = Math.log2(capacity);
        const bots = await this.aiOrchestrator.spawnBotsForRoom(1, totalRounds, toSpawn);
        for (const bot of bots) {
            const lobbySkin = this.aiOrchestrator.getLobbySkin(bot);
            await this.redisService.addPlayerToRoom(bot.id, roomId, bot.name, lobbySkin);
            await this.redisService.addBotToRoom(bot.id, roomId);
        }
        console.log(`[LobbyService] Room ${roomId} : ${bots.length} bot(s) ajouté(s)`);
    }
    async handlePlayerLeave(roomId, clients) {
        const capacity = this.roomService.getRoomCapacity(roomId);
        if (capacity === undefined)
            return;
        if (this.roomService.isRoomActive(roomId))
            return;
        await this.spawnAndRegisterBots(roomId, 1);
        this.eventEmitter.emit('lobby.player_joined', {
            clients,
            roomId,
            playerCount: capacity,
        });
    }
};
exports.LobbyService = LobbyService;
exports.LobbyService = LobbyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof room_service_1.RoomService !== "undefined" && room_service_1.RoomService) === "function" ? _a : Object, typeof (_b = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _b : Object, typeof (_c = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _c : Object, typeof (_d = typeof phase_timer_service_1.PhaseTimerService !== "undefined" && phase_timer_service_1.PhaseTimerService) === "function" ? _d : Object, typeof (_e = typeof ai_orchestrator_service_1.AiOrchestratorService !== "undefined" && ai_orchestrator_service_1.AiOrchestratorService) === "function" ? _e : Object, typeof (_f = typeof player_service_1.PlayerService !== "undefined" && player_service_1.PlayerService) === "function" ? _f : Object])
], LobbyService);


/***/ },

/***/ "./apps/game-service/src/main.ts"
/*!***************************************!*\
  !*** ./apps/game-service/src/main.ts ***!
  \***************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./apps/game-service/src/app.module.ts");
const platform_ws_1 = __webpack_require__(/*! @nestjs/platform-ws */ "@nestjs/platform-ws");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const cookie_parser_1 = __importDefault(__webpack_require__(/*! cookie-parser */ "cookie-parser"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useWebSocketAdapter(new platform_ws_1.WsAdapter(app));
    app.enableCors({
        origin: configService.get('FRONTEND_URL'),
        credentials: true,
    });
    app.connectMicroservice({
        transport: microservices_1.Transport.TCP,
        options: {
            host: '0.0.0.0',
            port: 40001,
        },
    });
    await app.startAllMicroservices();
    app.use((0, cookie_parser_1.default)());
    await app.listen(process.env.GAME_SERVICE_PORT ?? 3000);
}
bootstrap();


/***/ },

/***/ "./apps/game-service/src/redis/redis.const.ts"
/*!****************************************************!*\
  !*** ./apps/game-service/src/redis/redis.const.ts ***!
  \****************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.REDIS_KEYS = exports.REDIS_CLIENT = void 0;
exports.REDIS_CLIENT = 'REDIS_CLIENT';
exports.REDIS_KEYS = {
    GAME_ACTIVE_ROOMS: 'game:active:rooms',
    GAME_INACTIVE_ROOMS: 'game:inactive:rooms',
    ROOM_PLAYERS: (roomId) => {
        return `room:${roomId}:players`;
    },
};


/***/ },

/***/ "./apps/game-service/src/redis/redis.module.ts"
/*!*****************************************************!*\
  !*** ./apps/game-service/src/redis/redis.module.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const secret_utils_1 = __webpack_require__(/*! libs/shared/src/utils/secret.utils */ "./libs/shared/src/utils/secret.utils.ts");
const redis_service_1 = __webpack_require__(/*! ./redis.service */ "./apps/game-service/src/redis/redis.service.ts");
const ioredis_1 = __importDefault(__webpack_require__(/*! ioredis */ "ioredis"));
const redis_const_1 = __webpack_require__(/*! ./redis.const */ "./apps/game-service/src/redis/redis.const.ts");
let RedisModule = class RedisModule {
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: redis_const_1.REDIS_CLIENT,
                useFactory: () => {
                    return new ioredis_1.default({
                        host: 'redis',
                        port: 6379,
                        password: (0, secret_utils_1.getSecret)('redis_password'),
                    });
                },
            },
            redis_service_1.RedisService,
        ],
        exports: [redis_const_1.REDIS_CLIENT],
    })
], RedisModule);


/***/ },

/***/ "./apps/game-service/src/redis/redis.service.ts"
/*!******************************************************!*\
  !*** ./apps/game-service/src/redis/redis.service.ts ***!
  \******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const built_1 = __importDefault(__webpack_require__(/*! ioredis/built */ "ioredis/built"));
const redis_const_1 = __webpack_require__(/*! ./redis.const */ "./apps/game-service/src/redis/redis.const.ts");
const lobby_const_1 = __webpack_require__(/*! ../lobby/lobby.const */ "./apps/game-service/src/lobby/lobby.const.ts");
const crypto_1 = __webpack_require__(/*! crypto */ "crypto");
let RedisService = class RedisService {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    async getActiveRooms() {
        return await this.redis.smembers(lobby_const_1.LOBBY_KEYS.ACTIVE_ROOMS);
    }
    async getInactiveRooms() {
        return await this.redis.smembers(lobby_const_1.LOBBY_KEYS.INACTIVE_ROOMS);
    }
    async freeRoomId(roomId) {
        await Promise.all([
            this.redis.srem(lobby_const_1.LOBBY_KEYS.USED_IDS, roomId),
            this.redis.sadd(lobby_const_1.LOBBY_KEYS.FREE_IDS, roomId),
        ]);
    }
    async addActiveRoom(roomId) {
        await this.redis.sadd(lobby_const_1.LOBBY_KEYS.ACTIVE_ROOMS, roomId);
    }
    async addInactiveRoom(roomId) {
        await this.redis.sadd(lobby_const_1.LOBBY_KEYS.INACTIVE_ROOMS, roomId);
    }
    async removeActiveRoom(roomId) {
        await this.redis.srem(lobby_const_1.LOBBY_KEYS.ACTIVE_ROOMS, roomId);
    }
    async removeInactiveRoom(roomId) {
        await this.redis.srem(lobby_const_1.LOBBY_KEYS.INACTIVE_ROOMS, roomId);
    }
    async markRoomActive(roomId) {
        await Promise.all([
            this.addActiveRoom(roomId),
            this.removeInactiveRoom(roomId),
        ]);
    }
    async setRoomTimer(roomId, countdown = lobby_const_1.DEFAULT.COUNTDOWN) {
        const endTime = Date.now() + 1000 * countdown;
        await this.redis.set(lobby_const_1.LOBBY_KEYS.ROOM_TIMER(roomId), endTime.toString());
    }
    async getRoomTimer(roomId) {
        const timestamp = await this.redis.get(lobby_const_1.LOBBY_KEYS.ROOM_TIMER(roomId));
        return timestamp === null ? 0 : parseInt(timestamp, 10);
    }
    async deleteRoomTimer(roomId) {
        await this.redis.del(lobby_const_1.LOBBY_KEYS.ROOM_TIMER(roomId));
    }
    async setRoomCapacity(roomId, capacity = lobby_const_1.DEFAULT.CAPACITY) {
        if (capacity <= 0 || (capacity & (capacity - 1)) !== 0) {
            capacity = lobby_const_1.DEFAULT.CAPACITY;
        }
        await this.redis.set(lobby_const_1.LOBBY_KEYS.ROOM_CAPACITY(roomId), capacity);
    }
    async getRoomCapacity(roomId) {
        const capacity = await this.redis.get(lobby_const_1.LOBBY_KEYS.ROOM_CAPACITY(roomId));
        return capacity ? parseInt(capacity, 10) : lobby_const_1.DEFAULT.CAPACITY;
    }
    async deleteRoomCapacity(roomId) {
        await this.redis.del(lobby_const_1.LOBBY_KEYS.ROOM_CAPACITY(roomId));
    }
    async addPlayerToRoom(playerId, roomId, username, skin) {
        await this.redis.hset(lobby_const_1.LOBBY_KEYS.ROOM_PLAYERS(roomId), playerId, JSON.stringify({ username, skin }));
    }
    async removePlayerFromRoom(playerId, roomId) {
        await this.redis.hdel(lobby_const_1.LOBBY_KEYS.ROOM_PLAYERS(roomId), playerId);
    }
    async getPlayersFromRoom(roomId) {
        const entries = await this.redis.hvals(lobby_const_1.LOBBY_KEYS.ROOM_PLAYERS(roomId));
        return entries.map((entry) => JSON.parse(entry));
    }
    async countPlayersInRoom(roomId) {
        return await this.redis.hlen(lobby_const_1.LOBBY_KEYS.ROOM_PLAYERS(roomId));
    }
    async deleteAllPlayersFromRoom(roomId) {
        await this.redis.del(lobby_const_1.LOBBY_KEYS.ROOM_PLAYERS(roomId));
    }
    async getRandRoomId() {
        const id = await this.redis.spop(lobby_const_1.LOBBY_KEYS.FREE_IDS);
        if (id) {
            await this.redis.sadd(lobby_const_1.LOBBY_KEYS.USED_IDS, id);
            return id;
        }
        return (0, crypto_1.randomUUID)();
    }
    async createRoom(capacity) {
        const id = await this.getRandRoomId();
        await Promise.all([
            this.addInactiveRoom(id),
            this.setRoomCapacity(id, capacity),
            this.setRoomTimer(id),
        ]);
        return id;
    }
    async deleteRoom(roomId) {
        await Promise.all([
            this.removeActiveRoom(roomId),
            this.removeInactiveRoom(roomId),
            this.deleteRoomTimer(roomId),
            this.deleteRoomCapacity(roomId),
            this.deleteAllPlayersFromRoom(roomId),
            this.deleteRoomBots(roomId),
            this.freeRoomId(roomId),
        ]);
    }
    async setData(key, value) {
        await this.redis.set(key, value, 'EX', 3600);
    }
    async getData(key) {
        return await this.redis.get(key);
    }
    async addToSet(key, elems) {
        if (elems?.length !== 0)
            await this.redis.sadd(key, ...elems);
    }
    async removeFromSet(key, elems) {
        if (elems?.length !== 0)
            await this.redis.srem(key, ...elems);
    }
    async isInSet(key, elem) {
        return (await this.redis.sismember(key, elem)) === 1;
    }
    async getSet(key) {
        return await this.redis.smembers(key);
    }
    async getSetLen(key) {
        return await this.redis.scard(key);
    }
    async prependToList(key, elems) {
        await this.redis.lpush(key, ...elems);
    }
    async appendToList(key, elems) {
        await this.redis.rpush(key, ...elems);
    }
    async getList(key, start, end) {
        return await this.redis.lrange(key, start, end);
    }
    async addBotToRoom(botId, roomId) {
        await this.redis.sadd(lobby_const_1.LOBBY_KEYS.ROOM_BOTS(roomId), botId);
    }
    async removeBotFromRoom(botId, roomId) {
        await this.redis.srem(lobby_const_1.LOBBY_KEYS.ROOM_BOTS(roomId), botId);
    }
    async getRoomBots(roomId) {
        return await this.redis.smembers(lobby_const_1.LOBBY_KEYS.ROOM_BOTS(roomId));
    }
    async popRoomBot(roomId) {
        return await this.redis.spop(lobby_const_1.LOBBY_KEYS.ROOM_BOTS(roomId));
    }
    async deleteRoomBots(roomId) {
        await this.redis.del(lobby_const_1.LOBBY_KEYS.ROOM_BOTS(roomId));
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_const_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [typeof (_a = typeof built_1.default !== "undefined" && built_1.default) === "function" ? _a : Object])
], RedisService);


/***/ },

/***/ "./apps/game-service/src/redis/redis_state.service.ts"
/*!************************************************************!*\
  !*** ./apps/game-service/src/redis/redis_state.service.ts ***!
  \************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisStateService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const built_1 = __importDefault(__webpack_require__(/*! ioredis/built */ "ioredis/built"));
const redis_const_1 = __webpack_require__(/*! ./redis.const */ "./apps/game-service/src/redis/redis.const.ts");
const state_player_const_1 = __webpack_require__(/*! ../game/state_player.const */ "./apps/game-service/src/game/state_player.const.ts");
let RedisStateService = class RedisStateService {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    async removePlayer(playerId) {
        const playerKey = state_player_const_1.STATE_PLAYER.player(playerId);
        const stateKey = state_player_const_1.STATE_PLAYER.state(playerId);
        await this.redis.del(stateKey);
        await this.redis.del(playerKey);
    }
    async getStatePlayer(playerId) {
        const key = state_player_const_1.STATE_PLAYER.state(playerId);
        const data = await this.redis.get(key);
        if (data)
            return JSON.parse(data);
        return undefined;
    }
    async updateStatePlayer(playerId, state) {
        const key = state_player_const_1.STATE_PLAYER.state(playerId);
        await this.redis.set(key, JSON.stringify(state), 'EX', 3600);
    }
    async removeStatePlayer(playerId) {
        const playerKey = state_player_const_1.STATE_PLAYER.player(playerId);
        const stateKey = state_player_const_1.STATE_PLAYER.state(playerId);
        await this.redis.del(stateKey);
        await this.redis.del(playerKey);
    }
};
exports.RedisStateService = RedisStateService;
exports.RedisStateService = RedisStateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_const_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [typeof (_a = typeof built_1.default !== "undefined" && built_1.default) === "function" ? _a : Object])
], RedisStateService);


/***/ },

/***/ "./apps/game-service/src/shared/clients.map.ts"
/*!*****************************************************!*\
  !*** ./apps/game-service/src/shared/clients.map.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clientsMap = void 0;
exports.clientsMap = new Map();


/***/ },

/***/ "./apps/game-service/src/shared/phase-timer.service.ts"
/*!*************************************************************!*\
  !*** ./apps/game-service/src/shared/phase-timer.service.ts ***!
  \*************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PhaseTimerService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const game_type_1 = __webpack_require__(/*! apps/game-service/src/game/game.type */ "./apps/game-service/src/game/game.type.ts");
let PhaseTimerService = class PhaseTimerService {
    timers = new Map();
    startTimes = new Map();
    start(roomId, phase, onTimeout) {
        this.clear(roomId);
        const duration = game_type_1.PHASE_DURATIONS[phase];
        this.startTimes.set(roomId, Math.floor(Date.now() / 1000));
        this.timers.set(roomId, setTimeout(onTimeout, duration * 1000));
    }
    getStartTime(roomId) {
        return this.startTimes.get(roomId);
    }
    clear(roomId) {
        const handle = this.timers.get(roomId);
        if (handle) {
            clearTimeout(handle);
            this.timers.delete(roomId);
        }
    }
};
exports.PhaseTimerService = PhaseTimerService;
exports.PhaseTimerService = PhaseTimerService = __decorate([
    (0, common_1.Injectable)()
], PhaseTimerService);


/***/ },

/***/ "./apps/game-service/src/shared/room.service.ts"
/*!******************************************************!*\
  !*** ./apps/game-service/src/shared/room.service.ts ***!
  \******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const clients_map_1 = __webpack_require__(/*! apps/game-service/src/shared/clients.map */ "./apps/game-service/src/shared/clients.map.ts");
const phase_timer_service_1 = __webpack_require__(/*! apps/game-service/src/shared/phase-timer.service */ "./apps/game-service/src/shared/phase-timer.service.ts");
const redis_service_1 = __webpack_require__(/*! ../redis/redis.service */ "./apps/game-service/src/redis/redis.service.ts");
let RoomService = class RoomService {
    phaseTimer;
    redis;
    constructor(phaseTimer, redis) {
        this.phaseTimer = phaseTimer;
        this.redis = redis;
    }
    rooms = new Map();
    async createRoom(capacity) {
        const id = await this.redis.createRoom(capacity);
        const finalCapacity = await this.redis.getRoomCapacity(id);
        this.rooms.set(id, {
            clients: new Set(),
            capacity: finalCapacity,
            active: false,
        });
        console.log(`Room created: ${id} (capacity ${finalCapacity})`);
        return id;
    }
    async joinRoom(client, roomId) {
        this.rooms.get(roomId)?.clients.add(client);
        const clientData = clients_map_1.clientsMap.get(client);
        if (clientData) {
            clientData.roomId = roomId;
        }
    }
    findAvailableRoom() {
        for (const [roomId, room] of this.rooms) {
            if (!room.active && room.clients.size < room.capacity)
                return roomId;
        }
        return null;
    }
    getRoomCapacity(roomId) {
        return this.rooms.get(roomId)?.capacity;
    }
    markRoomActive(roomId) {
        const room = this.rooms.get(roomId);
        if (room)
            room.active = true;
    }
    isRoomActive(roomId) {
        return this.rooms.get(roomId)?.active;
    }
    async leaveRoom(client, roomId, userId) {
        const room = this.rooms.get(roomId);
        if (!room)
            return null;
        room.clients.delete(client);
        await this.redis.removePlayerFromRoom(userId, roomId);
        console.log(`Client left ${roomId}, ${room.clients.size} players remaining`);
        if (room.clients.size === 0) {
            this.phaseTimer.clear(`lobby:${roomId}`);
            await this.redis.deleteRoom(roomId);
            this.rooms.delete(roomId);
            console.log(`Room ${roomId} deleted (empty)`);
            return null;
        }
        return room.clients;
    }
    getRoomSize(roomId) {
        return this.rooms.get(roomId)?.clients.size;
    }
    getClients(roomId) {
        return this.rooms.get(roomId)?.clients;
    }
};
exports.RoomService = RoomService;
exports.RoomService = RoomService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof phase_timer_service_1.PhaseTimerService !== "undefined" && phase_timer_service_1.PhaseTimerService) === "function" ? _a : Object, typeof (_b = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _b : Object])
], RoomService);


/***/ },

/***/ "./apps/game-service/src/shared/shared.module.ts"
/*!*******************************************************!*\
  !*** ./apps/game-service/src/shared/shared.module.ts ***!
  \*******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const room_service_1 = __webpack_require__(/*! apps/game-service/src/shared/room.service */ "./apps/game-service/src/shared/room.service.ts");
const phase_timer_service_1 = __webpack_require__(/*! apps/game-service/src/shared/phase-timer.service */ "./apps/game-service/src/shared/phase-timer.service.ts");
const redis_service_1 = __webpack_require__(/*! ../redis/redis.service */ "./apps/game-service/src/redis/redis.service.ts");
let SharedModule = class SharedModule {
};
exports.SharedModule = SharedModule;
exports.SharedModule = SharedModule = __decorate([
    (0, common_1.Module)({
        providers: [room_service_1.RoomService, phase_timer_service_1.PhaseTimerService, redis_service_1.RedisService],
        exports: [room_service_1.RoomService, phase_timer_service_1.PhaseTimerService],
    })
], SharedModule);


/***/ },

/***/ "./libs/shared/src/auth/guards/jwt-http.guard.ts"
/*!*******************************************************!*\
  !*** ./libs/shared/src/auth/guards/jwt-http.guard.ts ***!
  \*******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JwtHttpGuard_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtHttpGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
let JwtHttpGuard = JwtHttpGuard_1 = class JwtHttpGuard {
    jwtService;
    logger = new common_1.Logger(JwtHttpGuard_1.name);
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { method, url, ip } = request;
        const token = this.extractTokenFromCookie(request);
        if (!token) {
            this.logger.warn(`[AUTH FAIL] ${method} ${url} - IP: ${ip} - Missing or invalid token. Request Aborted.`);
            throw new common_1.UnauthorizedException('Missing JWT');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token);
            request['user'] = payload;
            this.logger.log(`[AUTH SUCCESS] ${method} ${url} - User: ${payload.id} - IP: ${ip}`);
            return true;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired JWT');
        }
    }
    extractTokenFromCookie(request) {
        if (request.cookies && request.cookies['access_token']) {
            const token = request.cookies['access_token'];
            if (typeof token === 'string') {
                return token;
            }
        }
        return undefined;
    }
};
exports.JwtHttpGuard = JwtHttpGuard;
exports.JwtHttpGuard = JwtHttpGuard = JwtHttpGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], JwtHttpGuard);


/***/ },

/***/ "./libs/shared/src/auth/guards/jwt-ws.guard.ts"
/*!*****************************************************!*\
  !*** ./libs/shared/src/auth/guards/jwt-ws.guard.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JwtWsGuard_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtWsGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const http_1 = __webpack_require__(/*! http */ "http");
const url = __importStar(__webpack_require__(/*! url */ "url"));
let JwtWsGuard = JwtWsGuard_1 = class JwtWsGuard {
    jwtService;
    logger = new common_1.Logger(JwtWsGuard_1.name);
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const client = context.switchToWs().getClient();
        const request = this.extractRequest(context, client);
        const token = this.extractToken(request);
        const event = context.switchToWs().getPattern() ||
            context.getHandler()?.name ||
            'WS Event';
        if (!token) {
            this.logger.warn(`[WS 401] Event: "${event}" - Socket: ${client?.user?.id || 'N/A'} - Missing token`);
            throw new websockets_1.WsException('Missing JWT');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token);
            client.user = payload;
            this.logger.log(`[WS AUTH SUCCESS] Event: "${event}" - Socket: ${client.user.id} - User: ${payload.username}`);
            return true;
        }
        catch {
            this.logger.warn(`[WS 401] Event: "${event}" - Socket: ${client?.user?.id || 'N/A'} - Invalid or expired JWT`);
            throw new websockets_1.WsException('Invalid JWT or expired');
        }
    }
    extractRequest(context, client) {
        const wsData = context.switchToWs().getData();
        if ('upgradeReq' in client &&
            client.upgradeReq instanceof http_1.IncomingMessage) {
            return client.upgradeReq;
        }
        if (wsData &&
            typeof wsData === 'object' &&
            wsData.req instanceof http_1.IncomingMessage) {
            return wsData.req;
        }
        return undefined;
    }
    extractToken(request) {
        if (!request) {
            return undefined;
        }
        if (typeof request.url === 'string') {
            const parsedUrl = url.parse(request.url, true);
            const tokenQuery = parsedUrl.query.token;
            if (typeof tokenQuery === 'string') {
                return tokenQuery;
            }
        }
        const authHeader = request.headers.authorization;
        if (typeof authHeader === 'string') {
            const parts = authHeader.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
                return parts[1];
            }
        }
        return undefined;
    }
};
exports.JwtWsGuard = JwtWsGuard;
exports.JwtWsGuard = JwtWsGuard = JwtWsGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], JwtWsGuard);


/***/ },

/***/ "./libs/shared/src/auth/shared-auth.module.ts"
/*!****************************************************!*\
  !*** ./libs/shared/src/auth/shared-auth.module.ts ***!
  \****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedJwtModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const jwt_http_guard_1 = __webpack_require__(/*! ./guards/jwt-http.guard */ "./libs/shared/src/auth/guards/jwt-http.guard.ts");
const jwt_ws_guard_1 = __webpack_require__(/*! ./guards/jwt-ws.guard */ "./libs/shared/src/auth/guards/jwt-ws.guard.ts");
const secret_utils_1 = __webpack_require__(/*! ../utils/secret.utils */ "./libs/shared/src/utils/secret.utils.ts");
const shared_auth_service_1 = __webpack_require__(/*! ./shared-auth.service */ "./libs/shared/src/auth/shared-auth.service.ts");
let SharedJwtModule = class SharedJwtModule {
};
exports.SharedJwtModule = SharedJwtModule;
exports.SharedJwtModule = SharedJwtModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                useFactory: () => ({
                    secret: (0, secret_utils_1.getSecret)('jwt_secret_key'),
                    signOptions: { expiresIn: '1d' },
                }),
            }),
        ],
        providers: [jwt_http_guard_1.JwtHttpGuard, jwt_ws_guard_1.JwtWsGuard, shared_auth_service_1.SharedAuthService],
        exports: [jwt_1.JwtModule, jwt_http_guard_1.JwtHttpGuard, jwt_ws_guard_1.JwtWsGuard, shared_auth_service_1.SharedAuthService],
    })
], SharedJwtModule);


/***/ },

/***/ "./libs/shared/src/auth/shared-auth.service.ts"
/*!*****************************************************!*\
  !*** ./libs/shared/src/auth/shared-auth.service.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SharedAuthService = void 0;
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let SharedAuthService = class SharedAuthService {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async verifyWsHandshake(request) {
        if (!request || !request.headers.cookie) {
            throw new common_1.UnauthorizedException('Cookie is missing.');
        }
        const token = this.getCookieValue(request.headers.cookie, 'access_token');
        if (!token) {
            throw new common_1.UnauthorizedException('Missing JWT');
        }
        try {
            return await this.jwtService.verifyAsync(token);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid JWT');
        }
    }
    getCookieValue(cookieHeader, cookieName) {
        if (!cookieHeader) {
            return undefined;
        }
        const prefix = `${cookieName}=`;
        for (const item of cookieHeader.split(';')) {
            const trimmed = item.trim();
            if (trimmed.startsWith(prefix)) {
                return trimmed.slice(prefix.length);
            }
        }
        return undefined;
    }
};
exports.SharedAuthService = SharedAuthService;
exports.SharedAuthService = SharedAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], SharedAuthService);


/***/ },

/***/ "./libs/shared/src/health/health.controller.ts"
/*!*****************************************************!*\
  !*** ./libs/shared/src/health/health.controller.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let HealthController = class HealthController {
    checkHealth() {
        return { status: 'ok' };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "checkHealth", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health')
], HealthController);


/***/ },

/***/ "./libs/shared/src/health/health.module.ts"
/*!*************************************************!*\
  !*** ./libs/shared/src/health/health.module.ts ***!
  \*************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const health_controller_1 = __webpack_require__(/*! ./health.controller */ "./libs/shared/src/health/health.controller.ts");
let HealthModule = class HealthModule {
};
exports.HealthModule = HealthModule;
exports.HealthModule = HealthModule = __decorate([
    (0, common_1.Module)({
        controllers: [health_controller_1.HealthController],
        providers: [],
        exports: [],
    })
], HealthModule);


/***/ },

/***/ "./libs/shared/src/utils/secret.utils.ts"
/*!***********************************************!*\
  !*** ./libs/shared/src/utils/secret.utils.ts ***!
  \***********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSecret = getSecret;
const fs_1 = __webpack_require__(/*! fs */ "fs");
function getSecret(name) {
    const secretPath = `/run/secrets/${name}`;
    console.log('name', name);
    if ((0, fs_1.existsSync)(secretPath)) {
        return (0, fs_1.readFileSync)(secretPath, 'utf8').trim();
    }
    return process.env[name];
}


/***/ },

/***/ "@nestjs/axios"
/*!********************************!*\
  !*** external "@nestjs/axios" ***!
  \********************************/
(module) {

module.exports = require("@nestjs/axios");

/***/ },

/***/ "@nestjs/common"
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
(module) {

module.exports = require("@nestjs/common");

/***/ },

/***/ "@nestjs/config"
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
(module) {

module.exports = require("@nestjs/config");

/***/ },

/***/ "@nestjs/core"
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
(module) {

module.exports = require("@nestjs/core");

/***/ },

/***/ "@nestjs/event-emitter"
/*!****************************************!*\
  !*** external "@nestjs/event-emitter" ***!
  \****************************************/
(module) {

module.exports = require("@nestjs/event-emitter");

/***/ },

/***/ "@nestjs/jwt"
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
(module) {

module.exports = require("@nestjs/jwt");

/***/ },

/***/ "@nestjs/microservices"
/*!****************************************!*\
  !*** external "@nestjs/microservices" ***!
  \****************************************/
(module) {

module.exports = require("@nestjs/microservices");

/***/ },

/***/ "@nestjs/platform-ws"
/*!**************************************!*\
  !*** external "@nestjs/platform-ws" ***!
  \**************************************/
(module) {

module.exports = require("@nestjs/platform-ws");

/***/ },

/***/ "@nestjs/schedule"
/*!***********************************!*\
  !*** external "@nestjs/schedule" ***!
  \***********************************/
(module) {

module.exports = require("@nestjs/schedule");

/***/ },

/***/ "@nestjs/typeorm"
/*!**********************************!*\
  !*** external "@nestjs/typeorm" ***!
  \**********************************/
(module) {

module.exports = require("@nestjs/typeorm");

/***/ },

/***/ "@nestjs/websockets"
/*!*************************************!*\
  !*** external "@nestjs/websockets" ***!
  \*************************************/
(module) {

module.exports = require("@nestjs/websockets");

/***/ },

/***/ "cookie-parser"
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
(module) {

module.exports = require("cookie-parser");

/***/ },

/***/ "ioredis"
/*!**************************!*\
  !*** external "ioredis" ***!
  \**************************/
(module) {

module.exports = require("ioredis");

/***/ },

/***/ "ioredis/built"
/*!********************************!*\
  !*** external "ioredis/built" ***!
  \********************************/
(module) {

module.exports = require("ioredis/built");

/***/ },

/***/ "rxjs"
/*!***********************!*\
  !*** external "rxjs" ***!
  \***********************/
(module) {

module.exports = require("rxjs");

/***/ },

/***/ "typeorm"
/*!**************************!*\
  !*** external "typeorm" ***!
  \**************************/
(module) {

module.exports = require("typeorm");

/***/ },

/***/ "ws"
/*!*********************!*\
  !*** external "ws" ***!
  \*********************/
(module) {

module.exports = require("ws");

/***/ },

/***/ "crypto"
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
(module) {

module.exports = require("crypto");

/***/ },

/***/ "fs"
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
(module) {

module.exports = require("fs");

/***/ },

/***/ "http"
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
(module) {

module.exports = require("http");

/***/ },

/***/ "url"
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
(module) {

module.exports = require("url");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./apps/game-service/src/main.ts");
/******/ 	
/******/ })()
;