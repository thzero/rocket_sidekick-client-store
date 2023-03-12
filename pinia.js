import AppConstants from '@/utility/constants';
import LibraryClientConstants from '@thzero/library_client/constants.js';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility';

import Response from '@thzero/library_common/response';

import BaseStore from '@thzero/library_client_vue3_store_pinia/store/index';

class AppStore extends BaseStore {
	// _initModules() {
	// 	// Admin Update
	// }

	_initPluginPersistConfig() {
		return {
			persist: {
				key: 'rocketsidekick',
				storage: localStorage,
				paths: [
					'flightInfoDataTypeUse',
					'flightInfoProcessor',
					'flightInfoResolution',
					'flightInfoStyle',
					'flightMeasurementUnits',
					'flightPathProcessor',
					'flightPathStyle',
					'motorManufacturers',
					'motorSearchCriteria',
					'motorSearchResults'
					// 'openSource',
					// 'plans',
					// 'user',
					// 'version'
				]
			}
			// persist2: {
			// 	key: 'rocket_sidekick',
			// 	includePaths: [
			// 		'flightInfoResolution',
			// 		'flightInfoStyle',
			// 		'flightPathStyle',
			// 		'motorManufacturers',
			// 		'motorSearchCriteria',
			// 		'motorSearchResults',
			// 	]
			// }
		};
	}

	_initStoreConfig() {
		return {
			state: () => ({
				checksumLastUpdate: [],
				content: [],
				contentTtl: 0,
				contentTtlDiff: 1000 * 60 * 30,
				contentMarkup: [],
				contentMarkupTtl: 0,
				contentMarkupTtlDiff: 1000 * 60 * 30,
				flightInfoDataTypeUse: null,
				flightData: {},
				flightDate: '',
				flightInfoProcessor: null,
				flightInfoResolution: AppConstants.FlightInfo.Resolution,
				flightInfoStyle: [],
				flightLocation: '',
				flightMeasurementUnits: {
					input: [],
					output: {
						id: null,
						distance: null,
						velocity: null
					}
				},
				flightPathProcessor: null,
				flightPathStyle: [],
				flightTitle: '',
				motorManufacturers: [],
				motorSearchCriteria: {},
				motorSearchResults: {},
				online: {},
				rockets: [],
				rocketsListing: [],
				rocketsTtl: 0,
				rocketsTtlDiff: 1000 * 60 * 30,
				rocketsUser: [],
				rocketsListingUser: [],
				thrust2weight: {},
				toolSettings: []
			}),
			actions: {
				async _initialize(correlationId, results) {
					const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_UTILITY);
					const response = await service.content(correlationId);
					if (Response.hasSucceeded(response))
						await this.setContent(correlationId, response.results);
				},
				async requestContent(correlationId) {
					const now = LibraryCommonUtility.getTimestamp();
					const ttlContent = this.contentTtl ? this.contentTtl : 0;
					const delta = now - ttlContent;
					if (this.content && (delta <= this.contentTtlDiff))
						return Response.success(correlationId, this.content);

					const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_UTILITY);
					const response = await service.content(correlationId);
					this.$logger.debug('store', 'requestContent', 'response', response, correlationId);
					if (Response.hasSucceeded(response)) {
						await this.setContent(correlationId, response.results);
						return response;
					}

					return Response.error('store', 'requestContent', null, null, null, null, correlationId);
				},
				async requestContentMarkup(correlationId, contentId) {
					if (String.isNullOrEmpty(contentId))
						return Response.error('store', 'requestContentMarkup', 'contentId', null, null, null, correlationId);

					const now = LibraryCommonUtility.getTimestamp();
					const ttlContent = this.contentMarkupTtl ? this.contentMarkupTtl : 0;
					const delta = now - ttlContent;
					if (this.contentMarkup && (delta <= this.contentMarkupTtlDiff)) {
						const content = LibraryClientUtility.$store.contentMarkup.find(l => l.id.toLowerCase() === contentId.toLowerCase());
						if (!String.isNullOrEmpty(content))
							return Response.success(correlationId, content);
					}

					const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_UTILITY);
					const response = await service.contentMarkup(correlationId, contentId);
					this.$logger.debug('store', 'requestContentMarkup', 'response', response, correlationId);
					if (Response.hasSucceeded(response)) {
						this.setContentMarkup(correlationId, response.results);
						return Response.success(correlationId, response.results);
					}

					return Response.error('store', 'requestContentMarkup', null, null, null, null, correlationId);
				},
				async requestMotor(correlationId, motorId) {
					const service = LibraryClientUtility.$injector.getService(AppConstants.InjectorKeys.SERVICE_EXTERNAL_MOTOR_SEARCH);
					const response = await service.motor(correlationId, motorId, this.motorSearchResults);
					this.$logger.debug('store', 'requestMotor', 'response', response, correlationId);
					if (Response.hasSucceeded(response)) {
						this.motorSearchResults = response.results.data;
						// return response.results.motor;
						return Response.success(correlationId, response.results.motor);
					}

					return Response.error('store', 'requestMotor', null, null, null, null, correlationId);
				},
				async requestMotorManufacturers(correlationId) {
					const service = LibraryClientUtility.$injector.getService(AppConstants.InjectorKeys.SERVICE_EXTERNAL_MOTOR_SEARCH);
					const response = await service.manufacturers(correlationId, this.motorManufacturers);
					this.$logger.debug('store', 'requestMotorManufacturers', 'response', response, correlationId);
					if (Response.hasSucceeded(response)) {
						this.motorManufacturers = response.results;
						return this.motorManufacturers.manufacturers;
					}

					return [];
				},
				async requestMotorSearchReset(correlationId) {
					this.motorManufacturers.ttl = null;
					this.motorManufacturers.last = null;
					this.motorSearchResults.ttl = null;
					this.motorSearchResults.last = null;
				},
				async requestMotorSearchResults(correlationId, criteria) {
					const service = LibraryClientUtility.$injector.getService(AppConstants.InjectorKeys.SERVICE_EXTERNAL_MOTOR_SEARCH);
					const response = await service.search(correlationId, criteria, this.motorSearchResults);
					this.$logger.debug('store', 'requestMotorSearchResults', 'response', response, correlationId);
					if (Response.hasSucceeded(response)) {
						this.motorSearchResults = response.results.data;
						return response.results.filtered;
					}

					return [];
				},
				async requestRocketsById(correlationId, id) {
					// const now = LibraryCommonUtility.getTimestamp();
					// const ttlContent = this.rocketsTtl ? this.rocketsTtl : 0;
					// const delta = now - ttlContent;
					// if (this.rockets && (delta <= this.rocketsTtlDiff))
					// 	return Response.success(correlationId, this.rockets);

					let rocket = null;
					if (this.rockets)
						rocket = this.rockets.find(l => l.id === id);
					if (rocket)
						return Response.success(correlationId, rocket);

					const service = LibraryClientUtility.$injector.getService(AppConstants.InjectorKeys.SERVICE_ROCKETS);
					const response = await service.retrieve(correlationId, id);
					this.$logger.debug('store', 'requestRocketsById', 'response', response, correlationId);
					if (Response.hasSucceeded(response)) {
						await this.setRocket(correlationId, response.results);
						return Response.success(correlationId, response.results);
					}

					return Response.error('store', 'requestRocketsById', null, null, null, null, correlationId);
				},
				async requestRocketsByIdUser(correlationId, id) {
					// const now = LibraryCommonUtility.getTimestamp();
					// const ttlContent = this.rocketsTtl ? this.rocketsTtl : 0;
					// const delta = now - ttlContent;
					// if (this.rocketsUser && (delta <= this.rocketsTtlDiff))
					// 	return Response.success(correlationId, this.rocketsUser);

					let rocket = null;
					if (this.rocketsUser)
						rocket = this.rocketsUser.find(l => l.id === id);
					if (rocket)
						return Response.success(correlationId, rocket);

					const service = LibraryClientUtility.$injector.getService(AppConstants.InjectorKeys.SERVICE_ROCKETS);
					const response = await service.retrieveUser(correlationId, id);
					this.$logger.debug('store', 'requestRocketsByIdUser', 'response', response, correlationId);
					if (Response.hasSucceeded(response)) {
						await this.setRocketUser(correlationId, response.results);
						return Response.success(correlationId, response.results);
					}

					return Response.error('store', 'requestRocketsByIdUser', null, null, null, null, correlationId);
				},
				async requestRockets(correlationId, params) {
					// const now = LibraryCommonUtility.getTimestamp();
					// const ttlContent = this.rocketsTtl ? this.rocketsTtl : 0;
					// const delta = now - ttlContent;
					// if (this.rocketsListing && (delta <= this.rocketsTtlDiff))
					// 	return Response.success(correlationId, this.rocketsListing);

					const service = LibraryClientUtility.$injector.getService(AppConstants.InjectorKeys.SERVICE_ROCKETS);
					const response = await service.listing(correlationId, params);
					this.$logger.debug('store', 'requestRockets', 'response', response, correlationId);
					if (Response.hasSucceeded(response)) {
						await this.setRockets(correlationId, response.results.data);
						return Response.success(correlationId, response.results.data);
					}

					return Response.error('store', 'requestRockets', null, null, null, null, correlationId);
				},
				async requestRocketsUser(correlationId, params) {
					const service = LibraryClientUtility.$injector.getService(AppConstants.InjectorKeys.SERVICE_ROCKETS);
					const response = await service.listingUser(correlationId, params);
					this.$logger.debug('store', 'requestRocketsUser', 'response', response, correlationId);
					if (Response.hasSucceeded(response)) {
						await this.setRocketsListing(correlationId, response.results.data);
						return response.results.data;
					}

					return Response.error('store', 'requestRocketsUser', null, null, null, null, correlationId);
				},
				async setContent(correlationId, content) {
					this.$logger.debug('store', 'setContent', 'content.a', content, correlationId);
					this.$logger.debug('store', 'setContent', 'content.b', this.content, correlationId);
					this.content = content;
					this.contentTtl = LibraryCommonUtility.getTimestamp();
					this.$logger.debug('store', 'setContent', 'content.c', this.content, correlationId);
				},
				async setContentMarkup(correlationId, content) {
					this.$logger.debug('store', 'setContent', 'contentMarkup.a', content, correlationId);
					this.$logger.debug('store', 'setContent', 'contentMarkup.b', this.contentMarkup, correlationId);
					if (content && !String.isNullOrEmpty(content)) {
						this.contentMarkupTtl = LibraryCommonUtility.getTimestamp();
						LibraryCommonUtility.updateArrayByObject(this.contentMarkup, content);
					}
					this.$logger.debug('store', 'setContent', 'contentMarkup.c', this.contentMarkup, correlationId);
				},
				async setFlightInfoDataTypeUse(correlationId, value) {
					this.flightInfoDataTypeUse = value;
				},
				async setFlightData(correlationId, value) {
					this.flightData = value;
				},
				async setFlightDate(correlationId, value) {
					this.flightDate = value;
				},
				async setFlightInfoProcessor(correlationId, value) {
					this.flightInfoProcessor = value;
				},
				async setFlightInfoResolution(correlationId, value) {
					this.flightInfoResolution = value;
				},
				async setFlightInfoStyle(correlationId, value) {
					if (String.isNullOrEmpty(value.id))
						return;
					if (!this.flightInfoStyle)
						this.flightInfoStyle = [];
					this.flightInfoStyle = LibraryCommonUtility.updateArrayByObject(this.flightInfoStyle, value);
				},
				async setFlightLocation(correlationId, value) {
					this.flightLocation = value;
				},
				async setFlightMeasurementUnits(correlationId, value) {
					this.flightMeasurementUnits = value;
				},
				async setFlightPathProcessor(correlationId, value) {
					this.flightPathProcessor = value;
				},
				async setFlightPathStyle(correlationId, value) {
					if (String.isNullOrEmpty(value.id))
						return;
					if (!this.flightPathStyle)
						this.flightPathStyle = [];
					this.flightPathStyle = LibraryCommonUtility.updateArrayByObject(this.flightPathStyle, value);
				},
				async setFlightTitle(correlationId, value) {
					this.flightTitle = value;
				},
				async setMotorSearchCriteria(correlationId, value) {
					this.motorSearchCriteria = value;
				},
				async setMotorSearchResults(correlationId, value) {
					this.motorSearchResults = value;
				},
				async setOnline(correlationId, online) {
					this.$logger.debug('store', 'setOnline', 'online.a', online, correlationId);
					this.$logger.debug('store', 'setOnline', 'online.b', this.online, correlationId);
					this.online = online;
					this.$logger.debug('store', 'setOnline', 'online.c', this.online, correlationId);
				},
				async setRocket(correlationId, rocket) {
					this.$logger.debug('store', 'setRocket', 'rocket.a', rocket, correlationId);
					this.$logger.debug('store', 'setRocket', 'rockets.b', this.rockets, correlationId);
					this.rockets = LibraryCommonUtility.updateArrayByObject(this.rockets, rocket);
					this.rocketsTtl = LibraryCommonUtility.getTimestamp();
					this.$logger.debug('store', 'setRocket', 'rockets.c', this.rockets, correlationId);
				},
				async setRocketsListing(correlationId, rockets) {
					this.$logger.debug('store', 'setRocketsListing', 'rockets.a', rockets, correlationId);
					this.$logger.debug('store', 'setRocketsListing', 'rocketsListing.b', this.rocketsListing, correlationId);
					this.rocketsListing = rockets;
					this.$logger.debug('store', 'setRocketsListing', 'rocketsListing.c', this.rocketsListing, correlationId);
				},
				async setRocketUser(correlationId, rocket) {
					this.$logger.debug('store', 'setRocketUser', 'rocket.a', rocket, correlationId);
					this.$logger.debug('store', 'setRocketUser', 'rocketsUser.b', this.rocketsUser, correlationId);
					this.rocketsUser = LibraryCommonUtility.updateArrayByObject(this.rockets, rocket);
					this.rocketsTtl = LibraryCommonUtility.getTimestamp();
					this.$logger.debug('store', 'setRocketUser', 'rocketsUser.c', this.rocketsUser, correlationId);
				}
			},
			getters: {
				getContent() {
					return LibraryClientUtility.$store.content;
				},
				getContentInfo() {
					const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_FEATURES);
					const temp = LibraryClientUtility.$store.content;
					if (!temp)
						return [];
					if (!temp.info)
						return [];
					if (!service.features().MobileOnly)
						return temp.info;
					return temp.info.filter(l => l.mobile);
				},
				getContentTools() {
					const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_FEATURES);
					const temp = LibraryClientUtility.$store.content;
					if (!temp)
						return [];
					if (!temp.tools)
						return [];
					if (!service.features().MobileOnly)
						return temp.tools;
					return temp.tools.filter(l => l.mobile);
				},
				getFlightData() {
					return LibraryClientUtility.$store.flightData;
				},
				getFlightDate() {
					return LibraryClientUtility.$store.flightDate;
				},
				getFlightInfoDataTypeUse() {
					const value = LibraryClientUtility.$store.flightInfoDataTypeUse;
					return value !== null ? value : true;
				},
				getFlightInfoProcessor() {
					return LibraryClientUtility.$store.flightInfoProcessor;
				},
				getFlightInfoResolution() {
					return LibraryClientUtility.$store.flightInfoResolution;
				},
				getFlightInfoStyle() {
					if (!LibraryClientUtility.$store.flightInfoStyle)
						return null;
					return LibraryClientUtility.$store.flightInfoStyle.find(l => l.id);
				},
				getFlightLocation() {
					return LibraryClientUtility.$store.flightLocation;
				},
				getFlightMeasurementUnits() {
					return LibraryClientUtility.$store.flightMeasurementUnits;
				},
				getFlightPathProcessor() {
					return LibraryClientUtility.$store.flightPathProcessor;
				},
				getFlightPathStyle() {
					if (!LibraryClientUtility.$store.flightPathStyle)
						return null;
					return LibraryClientUtility.$store.flightPathStyle.find(l => l.id);
				},
				getFlightTitle() {
					return LibraryClientUtility.$store.flightTitle;
				},
				getsetMotorSearchCriteria() {
					return LibraryClientUtility.$store.motorSearchCriteria;
				},
				async getMotorSearchCriteria() {
					return LibraryClientUtility.$store.motorSearchCriteria;
				},
				getOnline() {
					return LibraryClientUtility.$store.online;
				},
				getRockets() {
					return LibraryClientUtility.$store.rockets;
				},
				getRocketsUser() {
					return LibraryClientUtility.$store.rocketsUser;
				}
			},
			dispatcher: {
				async requestContent(correlationId) {
					return await LibraryClientUtility.$store.requestContent(correlationId);
				},
				async requestContentMarkup(correlationId, contentId) {
					return await LibraryClientUtility.$store.requestContentMarkup(correlationId, contentId);
				},
				async requestMotor(correlationId, motorId) {
					return await LibraryClientUtility.$store.requestMotor(correlationId, motorId);
				},
				async requestMotorManufacturers(correlationId, results) {
					return await LibraryClientUtility.$store.requestMotorManufacturers(correlationId, results);
				},
				async requestMotorSearchReset(correlationId) {
					return await LibraryClientUtility.$store.requestMotorSearchReset(correlationId);
				},
				async requestMotorSearchResults(correlationId, criteria) {
					return await LibraryClientUtility.$store.requestMotorSearchResults(correlationId, criteria);
				},
				async requestRockets(correlationId, params) {
					return await LibraryClientUtility.$store.requestRockets(correlationId, params);
				},
				async requestRocketsById(correlationId, id) {
					return await LibraryClientUtility.$store.requestRocketsById(correlationId, id);
				},
				async requestRocketsByIdUser(correlationId, id) {
					return await LibraryClientUtility.$store.requestRocketsByIdUser(correlationId, id);
				},
				async requestRocketsUser(correlationId, params) {
					return await LibraryClientUtility.$store.requestRocketsUser(correlationId, params);
				},
				async setFlightInfoDataTypeUse(correlationId, value) {
					await LibraryClientUtility.$store.setFlightInfoDataTypeUse(correlationId, value);
				},
				async setFlightData(correlationId, value) {
					await LibraryClientUtility.$store.setFlightData(correlationId, value);
				},
				async setFlightDate(correlationId, value) {
					await LibraryClientUtility.$store.setFlightDate(correlationId, value);
				},
				async setFlightInfoProcessor(correlationId, value) {
					await LibraryClientUtility.$store.setFlightInfoProcessor(correlationId, value);
				},
				async setFlightInfoResolution(correlationId, value) {
					await LibraryClientUtility.$store.setFlightInfoResolution(correlationId, value);
				},
				async setFlightInfoStyle(correlationId, value) {
					await LibraryClientUtility.$store.setFlightInfoStyle(correlationId, value);
				},
				async setFlightLocation(correlationId, value) {
					await LibraryClientUtility.$store.setFlightLocation(correlationId, value);
				},
				async setFlightMeasurementUnits(correlationId, value) {
					await LibraryClientUtility.$store.setFlightMeasurementUnits(correlationId, value);
				},
				async setFlightPathProcessor(correlationId, value) {
					await LibraryClientUtility.$store.setFlightPathProcessor(correlationId, value);
				},
				async setFlightPathStyle(correlationId, value) {
					await LibraryClientUtility.$store.setFlightPathStyle(correlationId, value);
				},
				async setFlightTitle(correlationId, value) {
					await LibraryClientUtility.$store.setFlightTitle(correlationId, value);
				},
				async setMotorSearchCriteria(correlationId, value) {
					await LibraryClientUtility.$store.setMotorSearchCriteria(correlationId, value);
				},
				async setOnline(correlationId, value) {
					await LibraryClientUtility.$store.setOnline(correlationId, value);
				},
				async setRocket(correlationId, rocket) {
					await LibraryClientUtility.$store.setRocket(correlationId, value);
				},
				async setRocketsListing(correlationId, rockets) {
					await LibraryClientUtility.$store.setRocketsListing(correlationId, value);
				},
				async setRocketUser(correlationId, rocket) {
					await LibraryClientUtility.$store.setRocketUser(correlationId, value);
				}
			}
		};
	}
}

export default AppStore;
