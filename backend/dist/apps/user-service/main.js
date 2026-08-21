/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/user-service/src/app.controller.ts"
/*!*************************************************!*\
  !*** ./apps/user-service/src/app.controller.ts ***!
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let AppController = class AppController {
    constructor() { }
    getHealth() {
        return { status: 'OK', timestamp: new Date().toISOString() };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('/health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHealth", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [])
], AppController);


/***/ },

/***/ "./apps/user-service/src/app.module.ts"
/*!*********************************************!*\
  !*** ./apps/user-service/src/app.module.ts ***!
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
const app_controller_1 = __webpack_require__(/*! ./app.controller */ "./apps/user-service/src/app.controller.ts");
const users_module_1 = __webpack_require__(/*! ./users/users.module */ "./apps/user-service/src/users/users.module.ts");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const users_entity_1 = __webpack_require__(/*! ./users/entities/users.entity */ "./apps/user-service/src/users/entities/users.entity.ts");
const secret_utils_1 = __webpack_require__(/*! ../../../libs/shared/src/utils/secret.utils */ "./libs/shared/src/utils/secret.utils.ts");
const accounts_entity_1 = __webpack_require__(/*! ./users/entities/accounts.entity */ "./apps/user-service/src/users/entities/accounts.entity.ts");
const relationships_entity_1 = __webpack_require__(/*! ./socials/entities/relationships.entity */ "./apps/user-service/src/socials/entities/relationships.entity.ts");
const settings_module_1 = __webpack_require__(/*! ./settings/settings.module */ "./apps/user-service/src/settings/settings.module.ts");
const stats_entity_1 = __webpack_require__(/*! ./stats/stats.entity */ "./apps/user-service/src/stats/stats.entity.ts");
const health_module_1 = __webpack_require__(/*! libs/shared/src/health/health.module */ "./libs/shared/src/health/health.module.ts");
const auth_module_1 = __webpack_require__(/*! ./auth/auth.module */ "./apps/user-service/src/auth/auth.module.ts");
const socials_module_1 = __webpack_require__(/*! ./socials/socials.module */ "./apps/user-service/src/socials/socials.module.ts");
const stats_module_1 = __webpack_require__(/*! ./stats/stats.module */ "./apps/user-service/src/stats/stats.module.ts");
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
                    host: configService.get('DB_USERS_HOST') ?? 'localhost',
                    port: configService.get('DB_USERS_PORT') ?? 5432,
                    username: (0, secret_utils_1.getSecret)('db_users_username'),
                    password: (0, secret_utils_1.getSecret)('db_users_password'),
                    database: (0, secret_utils_1.getSecret)('db_users_db_name'),
                    entities: [users_entity_1.User, accounts_entity_1.Account, relationships_entity_1.Relationship, stats_entity_1.UserStats],
                    synchronize: true,
                }),
            }),
            users_module_1.UsersModule,
            settings_module_1.SettingsModule,
            stats_module_1.UserStatsModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            socials_module_1.SocialsModule,
        ],
        controllers: [app_controller_1.AppController],
    })
], AppModule);


/***/ },

/***/ "./apps/user-service/src/auth/auth.controller.ts"
/*!*******************************************************!*\
  !*** ./apps/user-service/src/auth/auth.controller.ts ***!
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthController_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const create_user_dto_1 = __webpack_require__(/*! ../users/dto/create-user.dto */ "./apps/user-service/src/users/dto/create-user.dto.ts");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./apps/user-service/src/auth/auth.service.ts");
const jwt_http_guard_1 = __webpack_require__(/*! libs/shared/src/auth/guards/jwt-http.guard */ "./libs/shared/src/auth/guards/jwt-http.guard.ts");
let AuthController = AuthController_1 = class AuthController {
    authService;
    logger = new common_1.Logger(AuthController_1.name);
    constructor(authService) {
        this.authService = authService;
    }
    async signup(ip, userDto, res) {
        try {
            const { user, token } = await this.authService.createUser(userDto);
            res.cookie('access_token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000,
            });
            this.logger.log(`[HTTP POST /auth/signup SUCCESS] User registered: ${user.username} (${user.id}) - IP: ${ip}`);
            return user;
        }
        catch (error) {
            const reason = error instanceof Error ? error.message : String(error);
            this.logger.warn(`[HTTP POST /auth/signup FAILED] Email/Username: ${userDto.email} - Reason: ${reason} - IP: ${ip}`);
            throw error;
        }
    }
    async authenticate(ip, { email, password }, res) {
        try {
            const { user, token } = await this.authService.validateUserCredentials(email, password);
            if (!user || !token) {
                this.logger.warn(`[HTTP POST /auth/signin FAILED] Invalid credentials for Email: ${email} - IP: ${ip}`);
                throw new common_1.NotFoundException('Invalid credentials');
            }
            res.cookie('access_token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000,
            });
            this.logger.log(`[HTTP POST /auth/signin SUCCESS] User authenticated: ${user.username} (${user.id}) - IP: ${ip}`);
            return user;
        }
        catch (error) {
            if (!(error instanceof common_1.NotFoundException)) {
                const reason = error instanceof Error ? error.message : String(error);
                this.logger.warn(`[HTTP POST /auth/signin ERROR] Email: ${email} - Reason: ${reason} - IP: ${ip}`);
            }
            throw error;
        }
    }
    async signinFortyTwo(ip, code, res) {
        if (!code) {
            this.logger.warn(`[HTTP POST /auth/signin_42 FAILED] Missing authorization code - IP: ${ip}`);
            throw new common_1.UnauthorizedException('Code missing');
        }
        try {
            const { token, user } = await this.authService.handleFortyTwoAuth(code);
            res.cookie('access_token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000,
            });
            this.logger.log(`[HTTP POST /auth/signin_42 SUCCESS] 42 Auth succeeded for User: ${user?.username} (${user?.id}) - IP: ${ip}`);
            return user;
        }
        catch (error) {
            const reason = error instanceof Error ? error.message : String(error);
            this.logger.warn(`[HTTP POST /auth/signin_42 FAILED] 42 OAuth exchange failed - Reason: ${reason} - IP: ${ip}`);
            throw error;
        }
    }
    signout(req, res) {
        const user = req.user;
        res.cookie('access_token', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 0,
        });
        this.logger.log(`[HTTP POST /auth/signout] User signed out: ${user?.username || 'unknown'} (${user?.id})`);
    }
    whoAmI(req) {
        const user = req.user;
        this.logger.log(`[HTTP GET /auth/me] Profile retrieved for User: ${user?.username} (${user?.id})`);
        return {
            user: req.user?.id,
            email: req.user?.email,
            username: req.user?.username,
            avatarUrl: req.user?.avatarUrl,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Ip)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof create_user_dto_1.CreateUserDto !== "undefined" && create_user_dto_1.CreateUserDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Ip)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authenticate", null);
__decorate([
    (0, common_1.Post)('/signin_42'),
    __param(0, (0, common_1.Ip)()),
    __param(1, (0, common_1.Body)('code')),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signinFortyTwo", null);
__decorate([
    (0, common_1.Post)('/signout'),
    (0, common_1.UseGuards)(jwt_http_guard_1.JwtHttpGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signout", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_http_guard_1.JwtHttpGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "whoAmI", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ },

/***/ "./apps/user-service/src/auth/auth.module.ts"
/*!***************************************************!*\
  !*** ./apps/user-service/src/auth/auth.module.ts ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./apps/user-service/src/auth/auth.service.ts");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./apps/user-service/src/auth/auth.controller.ts");
const users_module_1 = __webpack_require__(/*! ../users/users.module */ "./apps/user-service/src/users/users.module.ts");
const shared_auth_module_1 = __webpack_require__(/*! libs/shared/src/auth/shared-auth.module */ "./libs/shared/src/auth/shared-auth.module.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_auth_module_1.SharedJwtModule, users_module_1.UsersModule],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ },

/***/ "./apps/user-service/src/auth/auth.service.ts"
/*!****************************************************!*\
  !*** ./apps/user-service/src/auth/auth.service.ts ***!
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AuthService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const users_service_1 = __webpack_require__(/*! ../users/users.service */ "./apps/user-service/src/users/users.service.ts");
const bcryptjs_1 = __importDefault(__webpack_require__(/*! bcryptjs */ "bcryptjs"));
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const secret_utils_1 = __webpack_require__(/*! libs/shared/src/utils/secret.utils */ "./libs/shared/src/utils/secret.utils.ts");
const axios_1 = __importDefault(__webpack_require__(/*! axios */ "axios"));
const coalition_enum_1 = __webpack_require__(/*! ./types/coalition.enum */ "./apps/user-service/src/auth/types/coalition.enum.ts");
const user_response_dto_1 = __webpack_require__(/*! ../users/dto/user-response.dto */ "./apps/user-service/src/users/dto/user-response.dto.ts");
let AuthService = AuthService_1 = class AuthService {
    usersService;
    jwtService;
    configService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async createUser(createUserDto) {
        const saltRounds = 10;
        const hashedPassword = await bcryptjs_1.default.hash(createUserDto.password, saltRounds);
        const user = await this.usersService.createUser({
            email: createUserDto.email,
            passwordHash: hashedPassword,
            username: createUserDto.username,
        });
        this.logger.log(`[AUTH REGISTER] New local account created: ${user.username} (${user.id})`);
        const token = this.generateJwt(user);
        const sanitizedUser = new user_response_dto_1.UserResponseDto({
            id: user.id,
            email: user.email,
            username: user.username,
            avatarUrl: user.avatarUrl,
            coalitionId: user.coalitionId,
            settings: user.settings,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
        return { user: sanitizedUser, token };
    }
    generateJwt(user) {
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.userRoles,
            avatarUrl: user.avatarUrl,
            skin: user.settings.skin,
        };
        return this.jwtService.sign(payload);
    }
    async validateUserCredentials(email, password) {
        const user = await this.usersService.findOneByEmail(email, true);
        if (!user) {
            this.logger.warn(`[AUTH VALIDATION FAILED] No account found with email: ${email}`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            this.logger.warn(`[AUTH VALIDATION FAILED] Incorrect password for User: ${user.username} (${user.id})`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        this.logger.log(`[AUTH VALIDATION SUCCESS] Credentials verified for User: ${user.username} (${user.id})`);
        const token = this.generateJwt(user);
        return { user, token };
    }
    async handleFortyTwoAuth(code) {
        this.logger.log('[OAUTH 42] Exchanging authorization code for access token...');
        const accessToken = await this.exchangeCodeForToken(code);
        this.logger.log('[OAUTH 42] Fetching 42 profile and coalition data...');
        const profile = await this.getFortyTwoProfile(accessToken);
        const coal = await this.getFortyTwoCoal(accessToken, profile.id);
        const user = await this.usersService.findUserByFortyTwoId(profile.id);
        if (user) {
            this.logger.log(`[OAUTH 42 LOGIN] Existing user found: ${user.username} (${user.id}) - 42 ID: ${profile.id}`);
            const payload = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.userRoles,
                avatarUrl: user.avatarUrl,
            };
            const token = await this.jwtService.signAsync(payload);
            return { token, user };
        }
        this.logger.log(`[OAUTH 42 REGISTER] Creating new account for 42 User: ${profile.login} (42 ID: ${profile.id})`);
        const userProfile = {
            email: profile.email,
            username: profile.login,
            avatarUrl: profile.image?.link,
            coalitionId: coal?.id,
            fortyTwoId: profile.id,
        };
        const newUser = await this.usersService.createFortyTwoUser(userProfile);
        this.logger.log(`[OAUTH 42 REGISTER SUCCESS] New user created: ${newUser.username} (${newUser.id})`);
        const payload = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.userRoles,
            avatarUrl: newUser.avatarUrl,
        };
        const token = await this.jwtService.signAsync(payload);
        return { token, newUser };
    }
    async exchangeCodeForToken(code) {
        const redirect_uri = this.configService.get('FORTYTWO_REDIRECT_URI');
        const tokenExchangeUrl = this.configService.get('FORTYTWO_API_TOKENEXCHANGE');
        const client_id = (0, secret_utils_1.getSecret)('fortytwo_client_id');
        const client_secret = (0, secret_utils_1.getSecret)('fortytwo_client_secret');
        try {
            const tokenResponse = await axios_1.default.post(tokenExchangeUrl ?? 'https://api.intra.42.fr/oauth/token', {
                grant_type: 'authorization_code',
                client_id,
                client_secret,
                code,
                redirect_uri,
            });
            return tokenResponse.data.access_token;
        }
        catch (err) {
            let errorMessage = 'Unknown error';
            if (axios_1.default.isAxiosError(err)) {
                errorMessage =
                    err.response?.data?.error_description ||
                        err.response?.data?.message ||
                        err.message;
            }
            else if (err instanceof Error) {
                errorMessage = err.message;
            }
            this.logger.error(`[OAUTH 42 API ERROR] Token exchange failed: ${errorMessage}`);
            throw new common_1.UnauthorizedException('Failed to authenticate.');
        }
    }
    async getFortyTwoProfile(accessToken) {
        try {
            const response = await axios_1.default.get(`${this.configService.get('FORTYTWO_API') ??
                'https://api.intra.42.fr/v2'}/me`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return response.data;
        }
        catch (err) {
            let errorMessage = 'Unknown error';
            if (axios_1.default.isAxiosError(err)) {
                errorMessage =
                    err.response?.data?.message ||
                        err.response?.data?.error ||
                        err.message;
            }
            else if (err instanceof Error) {
                errorMessage = err.message;
            }
            this.logger.error(`[OAUTH 42 API ERROR] Profile fetch failed: ${errorMessage}`);
            throw new common_1.InternalServerErrorException("Couldn't fetch user's profile.");
        }
    }
    async getFortyTwoCoal(accessToken, userId) {
        try {
            const response = await axios_1.default.get(`${this.configService.get('FORTYTWO_API') ??
                'https://api.intra.42.fr/v2'}/users/${userId}/coalitions`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const coalitions = response.data;
            const current_coal = coalitions.find((coal) => Object.values(coalition_enum_1.CoalitionEnum).includes(coal.id));
            return current_coal;
        }
        catch (err) {
            let errorMessage = 'Unknown error';
            if (axios_1.default.isAxiosError(err)) {
                errorMessage =
                    err.response?.data?.message ||
                        err.response?.data?.error ||
                        err.message;
            }
            else if (err instanceof Error) {
                errorMessage = err.message;
            }
            this.logger.error(`[OAUTH 42 API ERROR] Coalition fetch failed for 42 User ${userId}: ${errorMessage}`);
            throw new common_1.InternalServerErrorException("Couldn't fetch user's coalitions.");
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object])
], AuthService);


/***/ },

/***/ "./apps/user-service/src/auth/types/coalition.enum.ts"
/*!************************************************************!*\
  !*** ./apps/user-service/src/auth/types/coalition.enum.ts ***!
  \************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CoalitionEnum = void 0;
var CoalitionEnum;
(function (CoalitionEnum) {
    CoalitionEnum[CoalitionEnum["TROJANS"] = 54] = "TROJANS";
    CoalitionEnum[CoalitionEnum["ATHENEANS"] = 53] = "ATHENEANS";
    CoalitionEnum[CoalitionEnum["SPARTANS"] = 52] = "SPARTANS";
})(CoalitionEnum || (exports.CoalitionEnum = CoalitionEnum = {}));


/***/ },

/***/ "./apps/user-service/src/main.ts"
/*!***************************************!*\
  !*** ./apps/user-service/src/main.ts ***!
  \***************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./apps/user-service/src/app.module.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const cookie_parser_1 = __importDefault(__webpack_require__(/*! cookie-parser */ "cookie-parser"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: configService.get('FRONTEND_URL'),
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.use((0, cookie_parser_1.default)());
    app.set('trust proxy', true);
    await app.listen(process.env.USERS_SERVICE_PORT ?? 3000);
}
void bootstrap();


/***/ },

/***/ "./apps/user-service/src/settings/dto/update-user-settings.dto.ts"
/*!************************************************************************!*\
  !*** ./apps/user-service/src/settings/dto/update-user-settings.dto.ts ***!
  \************************************************************************/
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
exports.UpdateUserSettingsDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class UpdateUserSettingsDto {
    theme;
    starter;
    skin;
}
exports.UpdateUserSettingsDto = UpdateUserSettingsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['light', 'dark'], {
        message: 'Theme must be either "light" or "dark"',
    }),
    __metadata("design:type", String)
], UpdateUserSettingsDto.prototype, "theme", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateUserSettingsDto.prototype, "starter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateUserSettingsDto.prototype, "skin", void 0);


/***/ },

/***/ "./apps/user-service/src/settings/settings.controller.ts"
/*!***************************************************************!*\
  !*** ./apps/user-service/src/settings/settings.controller.ts ***!
  \***************************************************************/
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
var SettingsController_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SettingsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_http_guard_1 = __webpack_require__(/*! libs/shared/src/auth/guards/jwt-http.guard */ "./libs/shared/src/auth/guards/jwt-http.guard.ts");
const settings_service_1 = __webpack_require__(/*! ./settings.service */ "./apps/user-service/src/settings/settings.service.ts");
const update_user_settings_dto_1 = __webpack_require__(/*! ./dto/update-user-settings.dto */ "./apps/user-service/src/settings/dto/update-user-settings.dto.ts");
let SettingsController = SettingsController_1 = class SettingsController {
    settingsService;
    logger = new common_1.Logger(SettingsController_1.name);
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async getUserSettings(req) {
        if (!req?.user?.id) {
            this.logger.warn('[GET /settings] Unauthorized access attempt');
            throw new common_1.UnauthorizedException('Missing JWT');
        }
        const userId = req.user.id;
        const settings = (await this.settingsService.findSettingsById(userId)) ?? null;
        this.logger.log(`[GET /settings] Retrieved settings for user ${userId}`);
        return settings;
    }
    async updateUserSettings(req, updateSettingsDto) {
        if (!req?.user?.id) {
            this.logger.warn('[PATCH /update] Unauthorized access attempt');
            throw new common_1.UnauthorizedException('Missing JWT');
        }
        const userId = req.user.id;
        const updatedSettings = await this.settingsService.updateSettings(userId, updateSettingsDto);
        this.logger.log(`[PATCH /update] Updated settings for user ${userId}`);
        return updatedSettings;
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_http_guard_1.JwtHttpGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getUserSettings", null);
__decorate([
    (0, common_1.Patch)('update'),
    (0, common_1.UseGuards)(jwt_http_guard_1.JwtHttpGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof update_user_settings_dto_1.UpdateUserSettingsDto !== "undefined" && update_user_settings_dto_1.UpdateUserSettingsDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateUserSettings", null);
exports.SettingsController = SettingsController = SettingsController_1 = __decorate([
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [typeof (_a = typeof settings_service_1.SettingsService !== "undefined" && settings_service_1.SettingsService) === "function" ? _a : Object])
], SettingsController);


/***/ },

/***/ "./apps/user-service/src/settings/settings.module.ts"
/*!***********************************************************!*\
  !*** ./apps/user-service/src/settings/settings.module.ts ***!
  \***********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SettingsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const settings_controller_1 = __webpack_require__(/*! ./settings.controller */ "./apps/user-service/src/settings/settings.controller.ts");
const settings_service_1 = __webpack_require__(/*! ./settings.service */ "./apps/user-service/src/settings/settings.service.ts");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const users_entity_1 = __webpack_require__(/*! ../users/entities/users.entity */ "./apps/user-service/src/users/entities/users.entity.ts");
let SettingsModule = class SettingsModule {
};
exports.SettingsModule = SettingsModule;
exports.SettingsModule = SettingsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([users_entity_1.User])],
        controllers: [settings_controller_1.SettingsController],
        providers: [settings_service_1.SettingsService],
        exports: [settings_service_1.SettingsService],
    })
], SettingsModule);


/***/ },

/***/ "./apps/user-service/src/settings/settings.service.ts"
/*!************************************************************!*\
  !*** ./apps/user-service/src/settings/settings.service.ts ***!
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SettingsService = void 0;
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const users_entity_1 = __webpack_require__(/*! ../users/entities/users.entity */ "./apps/user-service/src/users/entities/users.entity.ts");
let SettingsService = class SettingsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findSettingsById(id) {
        const user = await this.repo.findOne({
            where: { id },
            select: { settings: true },
        });
        return user?.settings ?? null;
    }
    async updateSettings(id, newSettings) {
        const result = await this.repo
            .createQueryBuilder()
            .update(users_entity_1.User)
            .set({
            settings: () => 'settings || :newSettings::jsonb',
        })
            .setParameter('newSettings', JSON.stringify(newSettings))
            .where('id = :id', { id })
            .returning(['settings', 'updatedAt'])
            .execute();
        if (!result.affected) {
            throw new common_1.NotFoundException('Invalid User');
        }
        const rawList = result.raw;
        if (!rawList.length) {
            throw new common_1.NotFoundException('User not found');
        }
        const updatedRaw = rawList[0];
        return {
            settings: updatedRaw.settings,
            updatedAt: updatedRaw.updated_at,
        };
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], SettingsService);


/***/ },

/***/ "./apps/user-service/src/socials/dto/accept-friend-request.dto.ts"
/*!************************************************************************!*\
  !*** ./apps/user-service/src/socials/dto/accept-friend-request.dto.ts ***!
  \************************************************************************/
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
exports.AcceptFriendRequestDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class AcceptFriendRequestDto {
    id;
}
exports.AcceptFriendRequestDto = AcceptFriendRequestDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'Invalid requester ID format' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AcceptFriendRequestDto.prototype, "id", void 0);


/***/ },

/***/ "./apps/user-service/src/socials/dto/remove-relation.dto.ts"
/*!******************************************************************!*\
  !*** ./apps/user-service/src/socials/dto/remove-relation.dto.ts ***!
  \******************************************************************/
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
exports.RemoveRelationDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class RemoveRelationDto {
    id;
}
exports.RemoveRelationDto = RemoveRelationDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'Invalid target user ID format' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RemoveRelationDto.prototype, "id", void 0);


/***/ },

/***/ "./apps/user-service/src/socials/dto/send-friend-request.dto.ts"
/*!**********************************************************************!*\
  !*** ./apps/user-service/src/socials/dto/send-friend-request.dto.ts ***!
  \**********************************************************************/
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
exports.SendFriendRequestDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class SendFriendRequestDto {
    destinatory;
}
exports.SendFriendRequestDto = SendFriendRequestDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Identifier is missing' }),
    (0, class_validator_1.IsString)({ message: 'Not a string' }),
    __metadata("design:type", String)
], SendFriendRequestDto.prototype, "destinatory", void 0);


/***/ },

/***/ "./apps/user-service/src/socials/dto/send-game-invite.dto.ts"
/*!*******************************************************************!*\
  !*** ./apps/user-service/src/socials/dto/send-game-invite.dto.ts ***!
  \*******************************************************************/
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
exports.SendGameInviteDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class SendGameInviteDto {
    destinatory;
    roomId;
}
exports.SendGameInviteDto = SendGameInviteDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Identifier is missing' }),
    (0, class_validator_1.IsString)({ message: 'RoomId not a string' }),
    __metadata("design:type", String)
], SendGameInviteDto.prototype, "destinatory", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'RoomId is missing' }),
    (0, class_validator_1.IsString)({ message: 'RoomId not a string' }),
    __metadata("design:type", String)
], SendGameInviteDto.prototype, "roomId", void 0);


/***/ },

/***/ "./apps/user-service/src/socials/entities/relationships.entity.ts"
/*!************************************************************************!*\
  !*** ./apps/user-service/src/socials/entities/relationships.entity.ts ***!
  \************************************************************************/
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Relationship = exports.RelationshipStatus = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const users_entity_1 = __webpack_require__(/*! ../../users/entities/users.entity */ "./apps/user-service/src/users/entities/users.entity.ts");
var RelationshipStatus;
(function (RelationshipStatus) {
    RelationshipStatus["PENDING"] = "pending";
    RelationshipStatus["ACCEPTED"] = "accepted";
    RelationshipStatus["BLOCKED"] = "blocked";
})(RelationshipStatus || (exports.RelationshipStatus = RelationshipStatus = {}));
let Relationship = class Relationship {
    requesterId;
    requester;
    accepterId;
    accepter;
    status;
    createdAt;
    updatedAt;
};
exports.Relationship = Relationship;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'requester_id', type: 'uuid' }),
    __metadata("design:type", String)
], Relationship.prototype, "requesterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.sentRelationships, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'requester_id' }),
    __metadata("design:type", typeof (_a = typeof users_entity_1.User !== "undefined" && users_entity_1.User) === "function" ? _a : Object)
], Relationship.prototype, "requester", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'accepter_id', type: 'uuid' }),
    __metadata("design:type", String)
], Relationship.prototype, "accepterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.receivedRelationships, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'accepter_id' }),
    __metadata("design:type", typeof (_b = typeof users_entity_1.User !== "undefined" && users_entity_1.User) === "function" ? _b : Object)
], Relationship.prototype, "accepter", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RelationshipStatus,
        enumName: 'relationship_status_type',
        default: RelationshipStatus.PENDING,
    }),
    __metadata("design:type", String)
], Relationship.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamptz',
    }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Relationship.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamptz',
    }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Relationship.prototype, "updatedAt", void 0);
exports.Relationship = Relationship = __decorate([
    (0, typeorm_1.Entity)('relationships')
], Relationship);


/***/ },

/***/ "./apps/user-service/src/socials/social.controller.ts"
/*!************************************************************!*\
  !*** ./apps/user-service/src/socials/social.controller.ts ***!
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
var SocialsController_1;
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocialsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const send_friend_request_dto_1 = __webpack_require__(/*! ./dto/send-friend-request.dto */ "./apps/user-service/src/socials/dto/send-friend-request.dto.ts");
const jwt_http_guard_1 = __webpack_require__(/*! libs/shared/src/auth/guards/jwt-http.guard */ "./libs/shared/src/auth/guards/jwt-http.guard.ts");
const users_service_1 = __webpack_require__(/*! ../users/users.service */ "./apps/user-service/src/users/users.service.ts");
const socials_service_1 = __webpack_require__(/*! ./socials.service */ "./apps/user-service/src/socials/socials.service.ts");
const accept_friend_request_dto_1 = __webpack_require__(/*! ./dto/accept-friend-request.dto */ "./apps/user-service/src/socials/dto/accept-friend-request.dto.ts");
const remove_relation_dto_1 = __webpack_require__(/*! ./dto/remove-relation.dto */ "./apps/user-service/src/socials/dto/remove-relation.dto.ts");
const send_game_invite_dto_1 = __webpack_require__(/*! ./dto/send-game-invite.dto */ "./apps/user-service/src/socials/dto/send-game-invite.dto.ts");
let SocialsController = SocialsController_1 = class SocialsController {
    socialsService;
    usersService;
    logger = new common_1.Logger(SocialsController_1.name);
    constructor(socialsService, usersService) {
        this.socialsService = socialsService;
        this.usersService = usersService;
    }
    async getFriends(req) {
        if (!req?.user?.id) {
            this.logger.warn('[GET /friends] Unauthorized access attempt');
            throw new common_1.UnauthorizedException('Unauthorized call');
        }
        const userId = req.user.id;
        const friends = await this.socialsService.retrieveFriends(req.user.id);
        const chatService = 'http://chat_service:3000';
        const cookieHeader = req.headers['cookie'];
        try {
            const response = await fetch(`${chatService}/online_users`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(cookieHeader && { Cookie: cookieHeader }),
                },
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ users: friends }),
            });
            if (!response.ok) {
                this.logger.warn(`[GET /friends] Chat service returned status ${response.status} for user ${userId}`);
                throw new common_1.InternalServerErrorException('Chat service returned an error');
            }
            const onlineUsers = (await response.json());
            return onlineUsers;
        }
        catch (error) {
            if (error instanceof common_1.InternalServerErrorException) {
                throw error;
            }
            this.logger.error(`[GET /friends] Failed to communicate with chatService for user ${userId}: ${error instanceof Error ? error.message : String(error)}`);
            throw new common_1.InternalServerErrorException('Failed to communicate with chatService');
        }
    }
    async getPendingRequest(req) {
        if (!req.user?.id) {
            this.logger.warn('[GET /pending_requests] Unauthorized access attempt');
            throw new common_1.UnauthorizedException('Unauthorized call');
        }
        const userId = req.user.id;
        const pendingRequests = await this.socialsService.getReceivedRequest(userId);
        this.logger.log(`[GET /pending_requests] Retrieved pending requests for user ${userId}`);
        return pendingRequests;
    }
    async sendFriendRequest(req, sendFriendRequestDto) {
        if (!req?.user?.id) {
            this.logger.warn('[POST /send_request] Unauthorized access attempt');
            throw new common_1.UnauthorizedException('Unauthorized call');
        }
        const senderId = req.user.id;
        const sender = await this.usersService.findById(req.user.id);
        if (!sender) {
            this.logger.warn(`[POST /send_request] Sender account not found: ${senderId}`);
            throw new common_1.UnauthorizedException('Target user not found');
        }
        const destinatory = await this.usersService.findByIdentifier(sendFriendRequestDto.destinatory);
        if (!destinatory) {
            this.logger.warn(`[POST /send_request] Sender account not found: ${senderId}`);
            throw new common_1.UnauthorizedException('Invalid destinatory');
        }
        if (sender.id === destinatory.id) {
            this.logger.warn(`[POST /send_request] User ${senderId} attempted to add themselves`);
            throw new common_1.BadRequestException('Cannot send a friend request to yourself');
        }
        const existingRelation = await this.socialsService.checkExistingRequest(sender.id, destinatory.id);
        if (existingRelation) {
            this.logger.warn(`[POST /send_request] Relation already exists between ${sender.id} and ${destinatory.id}`);
            throw new common_1.ConflictException('Friend request already exists');
        }
        const request = await this.socialsService.createRequest(sender.id, destinatory.id);
        this.logger.log(`[POST /send_request] Friend request created: ${sender.id} -> ${destinatory.id}`);
        try {
            const response = await fetch(`http://chat_service:3000/send_request_notif`, {
                headers: { 'Content-type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({
                    senderId: sender.id,
                    destinatoryId: destinatory.id,
                }),
            });
            if (response.ok) {
                this.logger.log(`[POST /send_request] Notification sent to chat service for recipient ${destinatory.id}`);
            }
            else {
                this.logger.warn(`[POST /send_request] Chat service returned status ${response.status} for notification`);
            }
        }
        catch (error) {
            this.logger.error(`[POST /send_request] Error contacting chat service: ${error instanceof Error ? error.message : String(error)}`);
        }
        return request;
    }
    async acceptRequest(req, params) {
        if (!req?.user?.id) {
            this.logger.warn('[PATCH /accept/:id] Unauthorized access attempt');
            throw new common_1.UnauthorizedException('Unauthorized call');
        }
        const userId = req.user.id;
        const { id: requesterId } = params;
        if (userId === requesterId) {
            this.logger.warn(`[PATCH /accept/:id] User ${userId} attempted to accept a request from themselves`);
            throw new common_1.BadRequestException('Cannot accept a friend request from yourself');
        }
        const result = await this.socialsService.acceptFriendRequest(requesterId, userId);
        this.logger.log(`[PATCH /accept/:id] User ${userId} accepted friend request from ${requesterId}`);
        return result;
    }
    async removeRelationship(req, params) {
        if (!req?.user?.id) {
            this.logger.warn('[DELETE /remove_relation/:id] Unauthorized access attempt');
            throw new common_1.UnauthorizedException('Unauthorized call');
        }
        const userId = req.user.id;
        const { id: targetId } = params;
        if (userId === targetId) {
            this.logger.warn(`[DELETE /remove_relation/:id] User ${userId} attempted to remove relationship with themselves`);
            throw new common_1.BadRequestException('Cannot remove relationship with yourself');
        }
        const result = await this.socialsService.deleteFriendRequest(userId, targetId);
        this.logger.log(`[DELETE /remove_relation/:id] Relationship removed between ${userId} and ${targetId}`);
        return result;
    }
    async sendGameInvite(req, sendGameInviteDto) {
        if (!req?.user?.id) {
            this.logger.warn('[POST /send_game_invite] Unauthorized access attempt');
            throw new common_1.UnauthorizedException('Unauthorized call');
        }
        const senderId = req.user.id;
        const senderUsername = req.user.username;
        const roomId = sendGameInviteDto.roomId;
        const destinatoryId = sendGameInviteDto.destinatory;
        const existingFriendship = await this.socialsService.checkExistingFriendship(senderId, destinatoryId);
        if (!existingFriendship) {
            this.logger.warn(`[POST /send_game_invite] No Friendship relation between ${senderId} and ${destinatoryId}`);
            throw new common_1.UnauthorizedException('Target user not found');
        }
        const response = await fetch(`http://chat_service:3000/send_game_invite`, {
            headers: { 'Content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                senderId,
                senderUsername,
                destinatoryId,
                roomId,
            }),
        }).catch((error) => {
            this.logger.error(`[POST /send_game_invite] Error contacting chat service: ${error instanceof Error ? error.message : String(error)}`);
        });
        if (response && response.ok) {
            this.logger.log(`[POST /send_game_invite] Notification sent to chat service for recipient ${destinatoryId}`);
            return { send: true };
        }
        else {
            this.logger.warn(`[POST /send_game_invite] Chat service returned status ${response?.status} for game invitation`);
        }
        return { send: false };
    }
};
exports.SocialsController = SocialsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_http_guard_1.JwtHttpGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], SocialsController.prototype, "getFriends", null);
__decorate([
    (0, common_1.Get)('pending_requests'),
    (0, common_1.UseGuards)(jwt_http_guard_1.JwtHttpGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocialsController.prototype, "getPendingRequest", null);
__decorate([
    (0, common_1.Post)('send_request'),
    (0, common_1.UseGuards)(jwt_http_guard_1.JwtHttpGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof send_friend_request_dto_1.SendFriendRequestDto !== "undefined" && send_friend_request_dto_1.SendFriendRequestDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], SocialsController.prototype, "sendFriendRequest", null);
__decorate([
    (0, common_1.Patch)('accept/:id'),
    (0, common_1.UseGuards)(jwt_http_guard_1.JwtHttpGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_e = typeof accept_friend_request_dto_1.AcceptFriendRequestDto !== "undefined" && accept_friend_request_dto_1.AcceptFriendRequestDto) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], SocialsController.prototype, "acceptRequest", null);
__decorate([
    (0, common_1.Delete)('remove_relation/:id'),
    (0, common_1.UseGuards)(jwt_http_guard_1.JwtHttpGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_f = typeof remove_relation_dto_1.RemoveRelationDto !== "undefined" && remove_relation_dto_1.RemoveRelationDto) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], SocialsController.prototype, "removeRelationship", null);
__decorate([
    (0, common_1.Post)('send_game_invite'),
    (0, common_1.UseGuards)(jwt_http_guard_1.JwtHttpGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_g = typeof send_game_invite_dto_1.SendGameInviteDto !== "undefined" && send_game_invite_dto_1.SendGameInviteDto) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], SocialsController.prototype, "sendGameInvite", null);
exports.SocialsController = SocialsController = SocialsController_1 = __decorate([
    (0, common_1.Controller)('friends'),
    __metadata("design:paramtypes", [typeof (_a = typeof socials_service_1.SocialService !== "undefined" && socials_service_1.SocialService) === "function" ? _a : Object, typeof (_b = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _b : Object])
], SocialsController);


/***/ },

/***/ "./apps/user-service/src/socials/socials.module.ts"
/*!*********************************************************!*\
  !*** ./apps/user-service/src/socials/socials.module.ts ***!
  \*********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocialsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const social_controller_1 = __webpack_require__(/*! ./social.controller */ "./apps/user-service/src/socials/social.controller.ts");
const socials_service_1 = __webpack_require__(/*! ./socials.service */ "./apps/user-service/src/socials/socials.service.ts");
const users_module_1 = __webpack_require__(/*! ../users/users.module */ "./apps/user-service/src/users/users.module.ts");
const relationships_entity_1 = __webpack_require__(/*! ./entities/relationships.entity */ "./apps/user-service/src/socials/entities/relationships.entity.ts");
let SocialsModule = class SocialsModule {
};
exports.SocialsModule = SocialsModule;
exports.SocialsModule = SocialsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([relationships_entity_1.Relationship]), users_module_1.UsersModule],
        controllers: [social_controller_1.SocialsController],
        providers: [socials_service_1.SocialService],
    })
], SocialsModule);


/***/ },

/***/ "./apps/user-service/src/socials/socials.service.ts"
/*!**********************************************************!*\
  !*** ./apps/user-service/src/socials/socials.service.ts ***!
  \**********************************************************/
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
exports.SocialService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const relationships_entity_1 = __webpack_require__(/*! ./entities/relationships.entity */ "./apps/user-service/src/socials/entities/relationships.entity.ts");
const typeorm_2 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
let SocialService = class SocialService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async retrieveFriends(userId) {
        const relationships = await this.repo
            .createQueryBuilder('rel')
            .leftJoinAndSelect('rel.requester', 'requester')
            .leftJoinAndSelect('rel.accepter', 'accepter')
            .where('(rel.requesterId = :userId OR rel.accepterId = :userId)', {
            userId,
        })
            .andWhere('rel.status = :status', { status: relationships_entity_1.RelationshipStatus.ACCEPTED })
            .getMany();
        return relationships.map((rel) => rel.requesterId === userId
            ? rel.accepter
            : rel.accepterId === userId
                ? rel.requester
                : null);
    }
    async createRequest(requesterId, accepterId) {
        const request = this.repo.create({ requesterId, accepterId });
        return await this.repo.save(request);
    }
    async checkExistingRequest(userId1, userId2) {
        return await this.repo.findOne({
            where: [
                { requesterId: userId1, accepterId: userId2 },
                { requesterId: userId2, accepterId: userId1 },
            ],
        });
    }
    async checkExistingFriendship(userId1, userId2) {
        return await this.repo.findOne({
            where: [
                {
                    requesterId: userId1,
                    accepterId: userId2,
                    status: relationships_entity_1.RelationshipStatus.ACCEPTED,
                },
                {
                    requesterId: userId2,
                    accepterId: userId1,
                    status: relationships_entity_1.RelationshipStatus.ACCEPTED,
                },
            ],
        });
    }
    async getReceivedRequest(userId) {
        return await this.repo
            .createQueryBuilder('relationship')
            .leftJoin('relationship.requester', 'requester')
            .select([
            'requester.id AS "id"',
            'requester.username AS "username"',
            'requester.avatarUrl AS "avatarUrl"',
            'requester.coalitionId AS "coalitionId"',
        ])
            .where('relationship.accepterId = :userId', { userId })
            .andWhere('relationship.status = :status', {
            status: relationships_entity_1.RelationshipStatus.PENDING,
        })
            .getRawMany();
    }
    async acceptFriendRequest(requesterId, accepterId) {
        return await this.repo.update({ requesterId, accepterId }, { status: relationships_entity_1.RelationshipStatus.ACCEPTED });
    }
    async deleteFriendRequest(userId1, userId2) {
        return await this.repo
            .createQueryBuilder()
            .delete()
            .from(relationships_entity_1.Relationship)
            .where('(requesterId = :userId1 AND accepterId = :userId2) OR (requesterId = :userId2 AND accepterId = :userId1)', { userId1, userId2 })
            .execute();
    }
};
exports.SocialService = SocialService;
exports.SocialService = SocialService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(relationships_entity_1.Relationship)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object])
], SocialService);


/***/ },

/***/ "./apps/user-service/src/stats/dto/update-all-stats.dto.ts"
/*!*****************************************************************!*\
  !*** ./apps/user-service/src/stats/dto/update-all-stats.dto.ts ***!
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateAllStatsDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class UpdateAllStatsDto {
    monsterCatch;
    win;
    lose;
    playerDefeated;
    asset;
}
exports.UpdateAllStatsDto = UpdateAllStatsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateAllStatsDto.prototype, "monsterCatch", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAllStatsDto.prototype, "win", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAllStatsDto.prototype, "lose", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateAllStatsDto.prototype, "playerDefeated", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAllStatsDto.prototype, "asset", void 0);


/***/ },

/***/ "./apps/user-service/src/stats/stats.controller.ts"
/*!*********************************************************!*\
  !*** ./apps/user-service/src/stats/stats.controller.ts ***!
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserStatsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const stats_services_1 = __webpack_require__(/*! ./stats.services */ "./apps/user-service/src/stats/stats.services.ts");
const update_all_stats_dto_1 = __webpack_require__(/*! ./dto/update-all-stats.dto */ "./apps/user-service/src/stats/dto/update-all-stats.dto.ts");
let UserStatsController = class UserStatsController {
    userStatService;
    constructor(userStatService) {
        this.userStatService = userStatService;
    }
    async updateAll(userId, dto) {
        await this.userStatService.allUpdate(userId, dto.monsterCatch, dto.win, dto.lose, dto.playerDefeated, dto.asset);
    }
};
exports.UserStatsController = UserStatsController;
__decorate([
    (0, common_1.Patch)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof update_all_stats_dto_1.UpdateAllStatsDto !== "undefined" && update_all_stats_dto_1.UpdateAllStatsDto) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], UserStatsController.prototype, "updateAll", null);
exports.UserStatsController = UserStatsController = __decorate([
    (0, common_1.Controller)('stats'),
    __metadata("design:paramtypes", [typeof (_a = typeof stats_services_1.UserStatService !== "undefined" && stats_services_1.UserStatService) === "function" ? _a : Object])
], UserStatsController);


/***/ },

/***/ "./apps/user-service/src/stats/stats.entity.ts"
/*!*****************************************************!*\
  !*** ./apps/user-service/src/stats/stats.entity.ts ***!
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserStats = void 0;
const users_entity_1 = __webpack_require__(/*! ../users/entities/users.entity */ "./apps/user-service/src/users/entities/users.entity.ts");
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
let UserStats = class UserStats {
    userId;
    user;
    totalPlayerDefeated;
    gamesWon;
    gamesLost;
    gamesPlayed;
    MonstersDiscovered;
    NbMonstersDiscovered;
    EndingsDiscovered;
    NbEndingsDiscovered;
    Achievements;
    NbAchievements;
    createdAt;
    updatedAt;
};
exports.UserStats = UserStats;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        name: 'user_id',
        type: 'uuid',
    }),
    __metadata("design:type", String)
], UserStats.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => users_entity_1.User, (user) => user.stats, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", typeof (_a = typeof users_entity_1.User !== "undefined" && users_entity_1.User) === "function" ? _a : Object)
], UserStats.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_player_defeated',
        default: 0,
    }),
    __metadata("design:type", Number)
], UserStats.prototype, "totalPlayerDefeated", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'games_won',
        default: 0,
    }),
    __metadata("design:type", Number)
], UserStats.prototype, "gamesWon", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'games_lost',
        default: 0,
    }),
    __metadata("design:type", Number)
], UserStats.prototype, "gamesLost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'games_played',
        default: 0,
    }),
    __metadata("design:type", Number)
], UserStats.prototype, "gamesPlayed", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'monsters_discovered',
        type: 'text',
        array: true,
        default: '{}',
    }),
    __metadata("design:type", Array)
], UserStats.prototype, "MonstersDiscovered", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'nb_monsters_discovered',
        default: 0,
    }),
    __metadata("design:type", Number)
], UserStats.prototype, "NbMonstersDiscovered", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'endings_discovered',
        type: 'text',
        array: true,
        default: '{}',
    }),
    __metadata("design:type", Array)
], UserStats.prototype, "EndingsDiscovered", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'nb_endings_discovered',
        default: 0,
    }),
    __metadata("design:type", Number)
], UserStats.prototype, "NbEndingsDiscovered", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'achievements',
        type: 'text',
        array: true,
        default: '{}',
    }),
    __metadata("design:type", Array)
], UserStats.prototype, "Achievements", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'nb_achievements',
        default: 0,
    }),
    __metadata("design:type", Number)
], UserStats.prototype, "NbAchievements", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamptz',
    }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], UserStats.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamptz',
    }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], UserStats.prototype, "updatedAt", void 0);
exports.UserStats = UserStats = __decorate([
    (0, typeorm_1.Entity)('users_stats')
], UserStats);


/***/ },

/***/ "./apps/user-service/src/stats/stats.module.ts"
/*!*****************************************************!*\
  !*** ./apps/user-service/src/stats/stats.module.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserStatsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const stats_controller_1 = __webpack_require__(/*! ./stats.controller */ "./apps/user-service/src/stats/stats.controller.ts");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const stats_services_1 = __webpack_require__(/*! ../stats/stats.services */ "./apps/user-service/src/stats/stats.services.ts");
const stats_entity_1 = __webpack_require__(/*! ./stats.entity */ "./apps/user-service/src/stats/stats.entity.ts");
let UserStatsModule = class UserStatsModule {
};
exports.UserStatsModule = UserStatsModule;
exports.UserStatsModule = UserStatsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([stats_entity_1.UserStats])],
        providers: [stats_services_1.UserStatService],
        controllers: [stats_controller_1.UserStatsController],
        exports: [
            typeorm_1.TypeOrmModule, stats_services_1.UserStatService
        ],
    })
], UserStatsModule);


/***/ },

/***/ "./apps/user-service/src/stats/stats.services.ts"
/*!*******************************************************!*\
  !*** ./apps/user-service/src/stats/stats.services.ts ***!
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserStatService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const stats_entity_1 = __webpack_require__(/*! ./stats.entity */ "./apps/user-service/src/stats/stats.entity.ts");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
let UserStatService = class UserStatService {
    userStatsRepository;
    constructor(userStatsRepository) {
        this.userStatsRepository = userStatsRepository;
    }
    async newWin(userId) {
        const stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            throw new Error(`No stat found for ${userId}`);
        }
        stats.gamesWon += 1;
        stats.gamesPlayed += 1;
        await this.userStatsRepository.save(stats);
    }
    async getWin(userId) {
        const stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            throw new Error(`No stat found for ${userId}`);
        }
        return stats.gamesWon;
    }
    async newLost(userId) {
        const stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            throw new Error(`No stat found for ${userId}`);
        }
        stats.gamesLost += 1;
        stats.gamesPlayed += 1;
        await this.userStatsRepository.save(stats);
    }
    async getLost(userId) {
        const stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            throw new Error(`No stat found for ${userId}`);
        }
        return stats.gamesLost;
    }
    async getGamePlayed(userId) {
        const stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            throw new Error(`No stat found for ${userId}`);
        }
        return stats.gamesPlayed;
    }
    async addPlayerDefeated(userId, nbPlayers) {
        const stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            throw new Error(`No stat found for ${userId}`);
        }
        stats.totalPlayerDefeated += nbPlayers;
        await this.userStatsRepository.save(stats);
    }
    async getPlayerDefeated(userId) {
        const stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            throw new Error(`No stat found for ${userId}`);
        }
        return stats.totalPlayerDefeated;
    }
    async newMonsterCatch(userId, monsterArray) {
        const stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            throw new Error(`No stat found for ${userId}`);
        }
        let hasChanged = false;
        for (const monster of monsterArray) {
            if (!stats.MonstersDiscovered.includes(monster)) {
                stats.MonstersDiscovered.push(monster);
                stats.NbMonstersDiscovered += 1;
                hasChanged = true;
            }
        }
        if (hasChanged) {
            await this.userStatsRepository.save(stats);
        }
    }
    async getMonsterCatch(userId) {
        const stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            throw new Error(`No stat found for ${userId}`);
        }
        return stats.MonstersDiscovered.length;
    }
    async getNbMonsterCatch(userId) {
        const stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            throw new Error(`No stat found for ${userId}`);
        }
        return stats.NbMonstersDiscovered;
    }
    async newEnding(userId, assetEnding) {
        const stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            throw new Error(`No stat found for ${userId}`);
        }
        let hasChanged = false;
        if (!stats.EndingsDiscovered.includes(assetEnding)) {
            stats.EndingsDiscovered.push(assetEnding);
            stats.NbEndingsDiscovered += 1;
            hasChanged = true;
        }
        if (hasChanged) {
            await this.userStatsRepository.save(stats);
        }
    }
    async getEnding(userId) {
        const stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            throw new Error(`No stat found for ${userId}`);
        }
        return stats.EndingsDiscovered.length;
    }
    async getNbEnding(userId) {
        const stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            throw new Error(`No stat found for ${userId}`);
        }
        return stats.NbEndingsDiscovered;
    }
    async newAchievement(userId, achievement) {
        const stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            throw new Error(`No stat found for ${userId}`);
        }
        let hasChanged = false;
        if (!stats.Achievements.includes(achievement)) {
            stats.Achievements.push(achievement);
            stats.NbAchievements += 1;
            hasChanged = true;
        }
        if (hasChanged) {
            await this.userStatsRepository.save(stats);
        }
    }
    async getAchivements(userId) {
        const stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            throw new Error(`No stat found for ${userId}`);
        }
        return stats.Achievements.length;
    }
    async getNbAchivements(userId) {
        const stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            throw new Error(`No stat found for ${userId}`);
        }
        return stats.NbAchievements;
    }
    async updateStat(userId) {
        const stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            throw new Error(`No stat found for ${userId}`);
        }
        stats.updatedAt = new Date();
        await this.userStatsRepository.save(stats);
    }
    async getUpdateStat(userId) {
        const stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            throw new Error(`No stat found for ${userId}`);
        }
        return stats.updatedAt;
    }
    async allUpdate(userId, monsterArray, win, lose, playerDefeated, assetEnding) {
        const stats = await this.userStatsRepository.findOne({ where: { userId } });
        if (!stats) {
            throw new Error(`No stat found for ${userId}`);
        }
        for (const monster of monsterArray) {
            if (!stats.MonstersDiscovered.includes(monster)) {
                stats.MonstersDiscovered.push(monster);
                stats.NbMonstersDiscovered += 1;
            }
        }
        if (stats.MonstersDiscovered.length === 9) {
            if (!stats.Achievements.includes("monsterCatch")) {
                stats.Achievements.push("monsterCatch");
                stats.NbAchievements += 1;
            }
        }
        stats.gamesPlayed += 1;
        if (win) {
            stats.gamesWon += 1;
            if (assetEnding) {
                if (!stats.EndingsDiscovered.includes(assetEnding)) {
                    stats.EndingsDiscovered.push(assetEnding);
                    stats.NbEndingsDiscovered += 1;
                }
            }
        }
        if (lose) {
            stats.gamesLost += 1;
        }
        if (stats.EndingsDiscovered.length === 10) {
            if (!stats.Achievements.includes("ending")) {
                stats.Achievements.push("ending");
                stats.NbAchievements += 1;
            }
        }
        if (stats.gamesWon === 1) {
            if (!stats.Achievements.includes("firstWin")) {
                stats.Achievements.push("firstWin");
                stats.NbAchievements += 1;
            }
        }
        if (playerDefeated > 0) {
            stats.totalPlayerDefeated += playerDefeated;
        }
        stats.updatedAt = new Date();
        await this.userStatsRepository.save(stats);
    }
};
exports.UserStatService = UserStatService;
exports.UserStatService = UserStatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stats_entity_1.UserStats)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], UserStatService);


/***/ },

/***/ "./apps/user-service/src/users/dto/create-user.dto.ts"
/*!************************************************************!*\
  !*** ./apps/user-service/src/users/dto/create-user.dto.ts ***!
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
exports.CreateUserDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const FORBIDDEN = [
    'admin',
    'administrator',
    'system',
    'root',
    'moderator',
    'support',
];
class CreateUserDto {
    email;
    password;
    username;
    avatarUrl;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid Email' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Mail is max 50 chars.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is missing' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(8, 20, {
        message: 'Password should be between 8 and 20 characters long.',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 10, { message: 'Username should be between 3 and 10 chars' }),
    (0, class_validator_1.IsNotIn)(FORBIDDEN, { message: 'Forbidden username' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "avatarUrl", void 0);


/***/ },

/***/ "./apps/user-service/src/users/dto/user-response.dto.ts"
/*!**************************************************************!*\
  !*** ./apps/user-service/src/users/dto/user-response.dto.ts ***!
  \**************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserResponseDto = exports.Settings = void 0;
class Settings {
    skin;
    theme;
    starter;
}
exports.Settings = Settings;
class UserResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
    }
    id;
    email;
    username;
    avatarUrl;
    coalitionId;
    settings;
    createdAt;
    updatedAt;
}
exports.UserResponseDto = UserResponseDto;


/***/ },

/***/ "./apps/user-service/src/users/entities/accounts.entity.ts"
/*!*****************************************************************!*\
  !*** ./apps/user-service/src/users/entities/accounts.entity.ts ***!
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Account = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const users_entity_1 = __webpack_require__(/*! ./users.entity */ "./apps/user-service/src/users/entities/users.entity.ts");
let Account = class Account {
    id;
    userId;
    user;
    provider;
    providerAccountId;
    createdAt;
};
exports.Account = Account;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Account.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'user_id',
        type: 'uuid',
    }),
    __metadata("design:type", String)
], Account.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.accounts, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", typeof (_a = typeof users_entity_1.User !== "undefined" && users_entity_1.User) === "function" ? _a : Object)
], Account.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
    }),
    __metadata("design:type", String)
], Account.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'provider_account_id',
        type: 'integer',
    }),
    __metadata("design:type", Number)
], Account.prototype, "providerAccountId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamptz',
    }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Account.prototype, "createdAt", void 0);
exports.Account = Account = __decorate([
    (0, typeorm_1.Entity)('accounts')
], Account);


/***/ },

/***/ "./apps/user-service/src/users/entities/users.entity.ts"
/*!**************************************************************!*\
  !*** ./apps/user-service/src/users/entities/users.entity.ts ***!
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
exports.User = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const userRole_enum_1 = __webpack_require__(/*! ../types/userRole.enum */ "./apps/user-service/src/users/types/userRole.enum.ts");
const accounts_entity_1 = __webpack_require__(/*! ./accounts.entity */ "./apps/user-service/src/users/entities/accounts.entity.ts");
const relationships_entity_1 = __webpack_require__(/*! ../../socials/entities/relationships.entity */ "./apps/user-service/src/socials/entities/relationships.entity.ts");
const stats_entity_1 = __webpack_require__(/*! ../../stats/stats.entity */ "./apps/user-service/src/stats/stats.entity.ts");
let User = class User {
    id;
    email;
    username;
    passwordHash;
    isOnboarded;
    createdAt;
    updatedAt;
    avatarUrl;
    coalitionId;
    settings;
    userRoles;
    accounts;
    stats;
    sentRelationships;
    receivedRelationships;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: true,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'password_hash',
        type: 'varchar',
        length: 255,
        nullable: true,
        select: false,
    }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_onboarded',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "isOnboarded", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamptz',
    }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamptz',
    }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'avatar_url',
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "avatarUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'coalition_id',
        type: 'integer',
        default: 0,
    }),
    __metadata("design:type", Number)
], User.prototype, "coalitionId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        default: {
            theme: 'dark',
            starter: 'pisciner',
            skin: 'dinoGreen',
        },
    }),
    __metadata("design:type", Object)
], User.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'user_roles',
        type: 'enum',
        enum: userRole_enum_1.UserRole,
        enumName: 'user_role_type',
        array: true,
        default: [userRole_enum_1.UserRole.USER],
    }),
    __metadata("design:type", Array)
], User.prototype, "userRoles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => accounts_entity_1.Account, (account) => account.user),
    __metadata("design:type", Array)
], User.prototype, "accounts", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => stats_entity_1.UserStats, (stats) => stats.user, { cascade: true }),
    __metadata("design:type", typeof (_c = typeof stats_entity_1.UserStats !== "undefined" && stats_entity_1.UserStats) === "function" ? _c : Object)
], User.prototype, "stats", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => relationships_entity_1.Relationship, (rel) => rel.requester),
    __metadata("design:type", Array)
], User.prototype, "sentRelationships", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => relationships_entity_1.Relationship, (rel) => rel.accepter),
    __metadata("design:type", Array)
], User.prototype, "receivedRelationships", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);


/***/ },

/***/ "./apps/user-service/src/users/types/userRole.enum.ts"
/*!************************************************************!*\
  !*** ./apps/user-service/src/users/types/userRole.enum.ts ***!
  \************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
    UserRole["BETA"] = "beta-tester";
})(UserRole || (exports.UserRole = UserRole = {}));


/***/ },

/***/ "./apps/user-service/src/users/users.controller.ts"
/*!*********************************************************!*\
  !*** ./apps/user-service/src/users/users.controller.ts ***!
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersController_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./apps/user-service/src/users/users.service.ts");
const jwt_http_guard_1 = __webpack_require__(/*! libs/shared/src/auth/guards/jwt-http.guard */ "./libs/shared/src/auth/guards/jwt-http.guard.ts");
let UsersController = UsersController_1 = class UsersController {
    usersService;
    logger = new common_1.Logger(UsersController_1.name);
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getProfile(req, username) {
        const user = await this.usersService.findProfileByUsername(username);
        if (!user) {
            this.logger.warn(`[HTTP GET /users/profile/${username} FAILED] User not found (Requested by: ${req?.user?.username || 'unknown'})`);
            throw new common_1.NotFoundException('User not found.');
        }
        this.logger.log(`[HTTP GET /users/profile/${username} SUCCESS] Profile fetched for ${username} by User: ${req?.user?.username} (${req?.user?.id})`);
        return {
            user: {
                username: user.username,
                email: user.email,
                coalitionId: user.coalitionId,
                createdAt: user.createdAt,
                avatarUrl: user.avatarUrl,
            },
            stats: {
                gamesLost: user.stats ? user.stats.gamesLost : 0,
                gamesWon: user.stats ? user.stats.gamesWon : 0,
                gamesPlayed: user.stats ? user.stats.gamesPlayed : 0,
                achievements: user.stats ? user.stats.Achievements : [],
                nbAchievements: user.stats ? user.stats.NbAchievements : 0,
                monsterDiscovered: user.stats ? user.stats.MonstersDiscovered : [],
                nbMonstersDiscovered: user.stats ? user.stats.NbMonstersDiscovered : 0,
                endingsDiscovered: user.stats ? user.stats.EndingsDiscovered : [],
                nbEndingsDiscovered: user.stats ? user.stats.NbEndingsDiscovered : 0,
                totalPlayerDefeated: user.stats ? user.stats.totalPlayerDefeated : 0,
            },
        };
    }
    async checkUsername(username) {
        if (!username || username.trim().length === 0) {
            this.logger.warn(`[HTTP GET /users/check_username FAILED] Missing or empty username parameter`);
            throw new common_1.BadRequestException('Invalid parameters.');
        }
        const available = await this.usersService.isUsernameAvailable(username);
        this.logger.log(`[HTTP GET /users/check_username] Checked username: "${username}" -> Available: ${available}`);
        return { available };
    }
    async checkEmail(email) {
        if (!email || email.trim().length === 0) {
            this.logger.warn(`[HTTP GET /users/check_email FAILED] Missing or empty email parameter`);
            throw new common_1.BadRequestException('Invalid parameters.');
        }
        const available = await this.usersService.isEmailAvailable(email);
        this.logger.log(`[HTTP GET /users/check_email] Checked email: "${email}" -> Available: ${available}`);
        return { available };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('profile/:username'),
    (0, common_1.UseGuards)(jwt_http_guard_1.JwtHttpGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('check_username'),
    __param(0, (0, common_1.Query)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "checkUsername", null);
__decorate([
    (0, common_1.Get)('check_email'),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "checkEmail", null);
exports.UsersController = UsersController = UsersController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], UsersController);


/***/ },

/***/ "./apps/user-service/src/users/users.module.ts"
/*!*****************************************************!*\
  !*** ./apps/user-service/src/users/users.module.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const users_controller_1 = __webpack_require__(/*! ./users.controller */ "./apps/user-service/src/users/users.controller.ts");
const users_entity_1 = __webpack_require__(/*! ./entities/users.entity */ "./apps/user-service/src/users/entities/users.entity.ts");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./apps/user-service/src/users/users.service.ts");
const stats_entity_1 = __webpack_require__(/*! ../stats/stats.entity */ "./apps/user-service/src/stats/stats.entity.ts");
const accounts_entity_1 = __webpack_require__(/*! ./entities/accounts.entity */ "./apps/user-service/src/users/entities/accounts.entity.ts");
const stats_services_1 = __webpack_require__(/*! ../stats/stats.services */ "./apps/user-service/src/stats/stats.services.ts");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([users_entity_1.User, stats_entity_1.UserStats, accounts_entity_1.Account])],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService, stats_services_1.UserStatService],
        exports: [users_service_1.UsersService, typeorm_1.TypeOrmModule],
    })
], UsersModule);


/***/ },

/***/ "./apps/user-service/src/users/users.service.ts"
/*!******************************************************!*\
  !*** ./apps/user-service/src/users/users.service.ts ***!
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
var UsersService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const users_entity_1 = __webpack_require__(/*! ./entities/users.entity */ "./apps/user-service/src/users/entities/users.entity.ts");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const stats_entity_1 = __webpack_require__(/*! ../stats/stats.entity */ "./apps/user-service/src/stats/stats.entity.ts");
const accounts_entity_1 = __webpack_require__(/*! ./entities/accounts.entity */ "./apps/user-service/src/users/entities/accounts.entity.ts");
let UsersService = UsersService_1 = class UsersService {
    userRepo;
    accountRepo;
    statsRepo;
    logger = new common_1.Logger(UsersService_1.name);
    constructor(userRepo, accountRepo, statsRepo) {
        this.userRepo = userRepo;
        this.accountRepo = accountRepo;
        this.statsRepo = statsRepo;
    }
    async createUser(userData) {
        try {
            const user = this.userRepo.create({
                ...userData,
                stats: this.statsRepo.create(),
            });
            const savedUser = await this.userRepo.save(user);
            this.logger.log(`[USERS] Created local user: ${savedUser.username} (${savedUser.id})`);
            return savedUser;
        }
        catch (error) {
            if (error instanceof typeorm_2.QueryFailedError) {
                const pgError = error;
                if (pgError.code === '23505') {
                    const detail = pgError.detail ?? '';
                    if (detail.includes('email')) {
                        this.logger.warn(`[USERS DB CONFLICT] Email already used`);
                        throw new common_1.ConflictException('Email already used.');
                    }
                    if (detail.includes('username')) {
                        this.logger.warn(`[USERS DB CONFLICT] Username already used`);
                        throw new common_1.ConflictException('Username already used.');
                    }
                    this.logger.warn(`[USERS DB CONFLICT] User already exists`);
                    throw new common_1.ConflictException('User already exists.');
                }
            }
            this.logger.error(`[USERS DB ERROR] Failed to create user: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
    async createFortyTwoUser(userData) {
        const { fortyTwoId, username: baseUsername, ...profileData } = userData;
        const uniqueUsername = await this.generateUniqueUsername(baseUsername);
        try {
            const user = this.userRepo.create({
                ...profileData,
                username: uniqueUsername,
                stats: this.statsRepo.create(),
            });
            const savedUser = await this.userRepo.save(user);
            const account = this.accountRepo.create({
                provider: '42',
                providerAccountId: fortyTwoId,
                userId: savedUser.id,
            });
            await this.accountRepo.save(account);
            this.logger.log(`[USERS] Created 42 user & linked account: ${savedUser.username} (${savedUser.id}) - 42 ID: ${fortyTwoId}`);
            return savedUser;
        }
        catch (error) {
            if (error instanceof typeorm_2.QueryFailedError) {
                const pgError = error;
                if (pgError.code === '23505') {
                    const detail = pgError.detail ?? '';
                    if (detail.includes('email')) {
                        this.logger.warn(`[USERS DB CONFLICT] 42 Email already used`);
                        throw new common_1.ConflictException('Email already used.');
                    }
                    if (detail.includes('username')) {
                        this.logger.warn(`[USERS DB CONFLICT] 42 Username already used`);
                        throw new common_1.ConflictException('Username already used.');
                    }
                    this.logger.warn(`[USERS DB CONFLICT] 42 User already exists`);
                    throw new common_1.ConflictException('User already exists.');
                }
            }
            this.logger.error(`[USERS DB ERROR] Failed to create 42 user: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
    async findOneByEmail(email, withPassword = false) {
        const query = this.userRepo
            .createQueryBuilder('user')
            .where('user.email = :email', { email: email.trim() });
        if (withPassword) {
            query.addSelect('user.passwordHash');
        }
        return query.getOne();
    }
    async findProfileByUsername(username, withPassword = false) {
        const query = this.userRepo
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.stats', 'stats')
            .where('user.username = :username', { username: username.trim() });
        if (withPassword) {
            query.addSelect('user.passwordHash');
        }
        return query.getOne();
    }
    async isUsernameAvailable(username) {
        const exists = await this.userRepo.exists({
            where: { username: username.trim() },
        });
        return !exists;
    }
    async generateUniqueUsername(baseUsername) {
        let candidate = baseUsername;
        let counter = 1;
        while (await this.userRepo.exists({ where: { username: candidate } })) {
            this.logger.debug(`[USERS] Username collision for '${candidate}', trying suffix _${counter}`);
            candidate = `${baseUsername}_${counter}`;
            counter++;
        }
        return candidate;
    }
    async isEmailAvailable(email) {
        const exists = await this.userRepo.exists({
            where: { email: email.trim().toLowerCase() },
        });
        return !exists;
    }
    async findUserByFortyTwoId(fortyTwoId) {
        const user = this.userRepo
            .createQueryBuilder('user')
            .innerJoin('user.accounts', 'account')
            .where('account.provider_account_id = :userId', {
            userId: String(fortyTwoId),
        })
            .getOne();
        return user;
    }
    async findByIdentifier(identifier) {
        return this.userRepo.findOne({
            where: [{ email: identifier }, { username: identifier }],
        });
    }
    async findById(id) {
        return this.userRepo.findOne({
            where: { id },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(accounts_entity_1.Account)),
    __param(2, (0, typeorm_1.InjectRepository)(stats_entity_1.UserStats)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object])
], UsersService);


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

/***/ "@nestjs/jwt"
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
(module) {

module.exports = require("@nestjs/jwt");

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

/***/ "axios"
/*!************************!*\
  !*** external "axios" ***!
  \************************/
(module) {

module.exports = require("axios");

/***/ },

/***/ "bcryptjs"
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
(module) {

module.exports = require("bcryptjs");

/***/ },

/***/ "class-validator"
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
(module) {

module.exports = require("class-validator");

/***/ },

/***/ "cookie-parser"
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
(module) {

module.exports = require("cookie-parser");

/***/ },

/***/ "typeorm"
/*!**************************!*\
  !*** external "typeorm" ***!
  \**************************/
(module) {

module.exports = require("typeorm");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./apps/user-service/src/main.ts");
/******/ 	
/******/ })()
;