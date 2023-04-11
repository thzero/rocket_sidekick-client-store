import AppSharedConstants from '@/utility/constants';
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
					...[
						// 'openSource',
						// 'plans',
						// 'user',
						// 'version'
					],
					...this._initPluginPersistConfigPaths(),
					...this._initPluginPersistConfigPathsTtl(),
					...this._initPluginPersistConfigPathsMotorSearch(),
					...this._initPluginPersistConfigPathsI()
				]
			}
		};
	}

	_initPluginPersistConfigPaths() {
		return [
			'manufacturers',
			'parts'
		];
	}

	_initPluginPersistConfigPathsTtl() {
		return [
			'checklistsTtl',
			'manufacturersTtl',
			'partsTtl'
		];
	}

	_initPluginPersistConfigPathsMotorSearch() {
		return [
			'motorSearchCriteria',
			'motorSearchResults'
		];
	}

	_initPluginPersistConfigPathsI() {
		return [];
	}

	_initStoreConfigActions() {
		return Object.assign(this._initStoreConfigActionsBase(), this._initStoreConfigActionsAdditional());
	}

	_initStoreConfigActionsAdditional() {
		return {};
	}

	_initStoreConfigActionsBase() {
		return {
			async _initialize(correlationId, results) {
				const serviceFeatures = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_FEATURES);
				this.mobileOnly = serviceFeatures.features().MobileOnly;

				const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_UTILITY);
				const response = await service.content(correlationId);
				if (Response.hasSucceeded(response))
					await this.setContent(correlationId, response.results);
			},
			async requestChecklistByIdShared(correlationId, id) {
				// const now = LibraryCommonUtility.getTimestamp();
				// const ttlContent = this.checklistsSharedTtl ? this.checklistsSharedTtl : 0;
				// const delta = now - ttlContent;
				// if (this.checklistsShared && (delta <= this.checklistsSharedTtlDiff))
				// 	return Response.success(correlationId, this.checklists);

				let checklist = null;
				if (this.checklistsShared)
					checklist = this.checklistsShared.find(l => l.id === id);
				if (checklist)
					return Response.success(correlationId, checklist);

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_CHECKLISTS);
				const response = await service.retrieveShared(correlationId, id);
				this.$logger.debug('store', 'requestChecklistByIdShared', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setChecklistShared(correlationId, response.results);
					return Response.success(correlationId, response.results);
				}

				return Response.error('store', 'requestChecklistByIdShared', null, null, null, null, correlationId);
			},
			async requestChecklistByIdUser(correlationId, id) {
				let checklist = null;
				if (this.checklistsUser)
					checklist = this.checklistsUser.find(l => l.id === id);
				if (checklist)
					return Response.success(correlationId, checklist);

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_CHECKLISTS);
				const response = await service.retrieveUser(correlationId, id);
				this.$logger.debug('store', 'requestChecklistByIdUser', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setChecklistUser(correlationId, response.results);
					return Response.success(correlationId, response.results);
				}

				return Response.error('store', 'requestChecklistByIdUser', null, null, null, null, correlationId);
			},
			async requestChecklistsShared(correlationId, params) {
				// TODO
				// const now = LibraryCommonUtility.getTimestamp();
				// const ttl = this.checklistsSharedTtl ? this.checklistsSharedTtl : 0;
				// const delta = now - ttl;
				// if (this.checklistsShared && (delta <= this.checklistsSharedTtlDiff))
				// 	return Response.success(correlationId, this.checklistsShared);

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_CHECKLISTS);
				const response = await service.listingShared(correlationId, params);
				this.$logger.debug('store', 'requestChecklistsShared', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setChecklistsShared(correlationId, response.results.data);
					return Response.success(correlationId, this.checklistsShared);
				}

				return Response.error('store', 'requestChecklistsShared', null, null, null, null, correlationId);
			},
			async requestChecklistsUser(correlationId, params) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_CHECKLISTS);
				const response = await service.listingUser(correlationId, params);
				this.$logger.debug('store', 'requestChecklistsUser', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setChecklistsUser(correlationId, response.results.data);
					return Response.success(correlationId, this.checklistsUser);
				}

				return Response.error('store', 'requestChecklistsUser', null, null, null, null, correlationId);
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
			async requestManufacturers(correlationId) {
				// TODO
				// const now = LibraryCommonUtility.getTimestamp();
				// const ttl = this.manufacturersTtl ? this.manufacturersTtl : 0;
				// const delta = now - ttl;
				// if (this.manufacturers && (delta <= this.manufacturersTtlDiff))
				// 	return Response.success(correlationId, this.manufacturers);

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_MANUFACTURERS);
				const response = await service.listing(correlationId, {});
				this.$logger.debug('store', 'requestManufacturers', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					this.manufacturers = response.results.data;
					return this.manufacturers;
				}

				return [];
			},
			async requestMotor(correlationId, motorId) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_EXTERNAL_MOTOR_SEARCH);
				const response = await service.motor(correlationId, motorId, this.motorSearchResults);
				this.$logger.debug('store', 'requestMotor', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					this.motorSearchResults = response.results.data;
					// return response.results.motor;
					return Response.success(correlationId, response.results.motor);
				}

				return Response.error('store', 'requestMotor', null, null, null, null, correlationId);
			},
			async requestMotorSearchReset(correlationId) {
				this.motorSearchResults.ttl = null;
				this.motorSearchResults.last = null;
			},
			async requestMotorSearchResults(correlationId, criteria) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_EXTERNAL_MOTOR_SEARCH);
				const response = await service.search(correlationId, criteria, this.motorSearchResults);
				this.$logger.debug('store', 'requestMotorSearchResults', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					this.motorSearchResults = response.results.data;
					return response.results.filtered;
				}

				return [];
			},
			async requestRocketById(correlationId, id) {
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

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.retrieve(correlationId, id);
				this.$logger.debug('store', 'requestRocketById', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setRocket(correlationId, response.results);
					return Response.success(correlationId, response.results);
				}

				return Response.error('store', 'requestRocketById', null, null, null, null, correlationId);
			},
			async requestRocketByIdUser(correlationId, id) {
				let rocket = null;
				if (this.rocketsUser)
					rocket = this.rocketsUser.find(l => l.id === id);
				if (rocket)
					return Response.success(correlationId, rocket);

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.retrieveUser(correlationId, id);
				this.$logger.debug('store', 'requestRocketByIdUser', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setRocketUser(correlationId, response.results);
					return Response.success(correlationId, response.results);
				}

				return Response.error('store', 'requestRocketByIdUser', null, null, null, null, correlationId);
			},
			async requestRockets(correlationId, params) {
				// const now = LibraryCommonUtility.getTimestamp();
				// const ttlContent = this.rocketsTtl ? this.rocketsTtl : 0;
				// const delta = now - ttlContent;
				// if (this.rocketsListing && (delta <= this.rocketsTtlDiff))
				// 	return Response.success(correlationId, this.rockets);

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.listing(correlationId, params);
				this.$logger.debug('store', 'requestRockets', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setRockets(correlationId, response.results.data);
					return Response.success(correlationId, this.rockets);
				}

				return Response.error('store', 'requestRockets', null, null, null, null, correlationId);
			},
			async requestRocketsUser(correlationId, params) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.listingUser(correlationId, params);
				this.$logger.debug('store', 'requestRocketsUser', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setRocketsUser(correlationId, response.results.data);
					return Response.success(correlationId, this.rocketsUser);
				}

				return Response.error('store', 'requestRocketsUser', null, null, null, null, correlationId);
			},
			async saveChecklistUser(correlationId, checklist) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_CHECKLISTS);
				const response = await service.saveUser(correlationId, checklist);
				this.$logger.debug('store', 'saveChecklistUser', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setChecklistUser(correlationId, response.results);
					return Response.success(correlationId, response.results);
				}

				return Response.error('store', 'saveChecklistUser', null, null, null, null, correlationId);
			},
			async setChecklistShared(correlationId, value) {
				this.$logger.debug('store', 'setChecklistShared', 'checklist.a', value, correlationId);
				this.$logger.debug('store', 'setChecklistShared', 'checklistsShared.b', this.checklistsShared, correlationId);
				this.checklistsShared = LibraryCommonUtility.updateArrayByObject(this.checklistsShared, value);
				this.checklistsSharedTtl = LibraryCommonUtility.getTimestamp();
				this.$logger.debug('store', 'setChecklistShared', 'checklistsShared.c', this.checklistsShared, correlationId);
			},
			async setChecklistsShared(correlationId, value) {
				this.$logger.debug('store', 'setChecklistsShared', 'checklists.a', value, correlationId);
				this.$logger.debug('store', 'setChecklistsShared', 'checklistsShared.b', this.checklistsShared, correlationId);
				this.checklistsShared = value;
				this.checklistsSharedTtl = LibraryCommonUtility.getTimestamp();
				this.$logger.debug('store', 'setChecklistsShared', 'checklistsShared.c', this.checklistsShared, correlationId);
			},
			async setChecklistsUser(correlationId, value) {
				this.$logger.debug('store', 'setChecklistsUser', 'checklists.a', value, correlationId);
				this.$logger.debug('store', 'setChecklistsUser', 'checklistsUser.b', this.checklistsUser, correlationId);
				this.checklistsUser = value;
				this.$logger.debug('store', 'setChecklistsUser', 'checklistsUser.c', this.checklistsUser, correlationId);
			},
			async setChecklistUser(correlationId, value) {
				this.$logger.debug('store', 'setChecklistUser', 'checklist.a', value, correlationId);
				this.$logger.debug('store', 'setChecklistUser', 'checklistsUser.b', this.checklistsUser, correlationId);
				this.checklistsUser = LibraryCommonUtility.updateArrayByObject(this.checklistsUser, value);
				this.$logger.debug('store', 'setChecklistUser', 'checklistsUser.c', this.checklistsUser, correlationId);
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
			async setRocket(correlationId, value) {
				this.$logger.debug('store', 'setRocket', 'rocket.a', value, correlationId);
				this.$logger.debug('store', 'setRocket', 'rockets.b', this.rockets, correlationId);
				this.rockets = LibraryCommonUtility.updateArrayByObject(this.rockets, value);
				this.rocketsTtl = LibraryCommonUtility.getTimestamp();
				this.$logger.debug('store', 'setRocket', 'rockets.c', this.rockets, correlationId);
			},
			async setRockets(correlationId, value) {
				this.$logger.debug('store', 'setRockets', 'rockets.a', value, correlationId);
				this.$logger.debug('store', 'setRockets', 'rockets.b', this.rockets, correlationId);
				this.rockets = value;
				this.rocketsTtl = LibraryCommonUtility.getTimestamp();
				this.$logger.debug('store', 'setRockets', 'rockets.c', this.rockets, correlationId);
			},
			async setRocketsUser(correlationId, value) {
				this.$logger.debug('store', 'setRocketsUser', 'rockets.a', value, correlationId);
				this.$logger.debug('store', 'setRocketsUser', 'rocketsUser.b', this.rocketsUser, correlationId);
				this.rocketsUser = value;
				this.$logger.debug('store', 'setRocketsUser', 'rocketsUser.c', this.rocketsUser, correlationId);
			},
			async setRocketUser(correlationId, value) {
				this.$logger.debug('store', 'setRocketUser', 'rocket.a', value, correlationId);
				this.$logger.debug('store', 'setRocketUser', 'rocketsUser.b', this.rocketsUser, correlationId);
				this.rocketsUser = LibraryCommonUtility.updateArrayByObject(this.rocketsUser, value);
				this.$logger.debug('store', 'setRocketUser', 'rocketsUser.c', this.rocketsUser, correlationId);
			}
		};
	}

	_initStoreConfigDispatchers() {
		return Object.assign(this._initStoreConfigDispatchersBase(), this._initStoreConfigDispatchersAdditional());
	}

	_initStoreConfigDispatchersAdditional() {
		return {};
	}

	_initStoreConfigDispatchersBase() {
		return {
			async requestChecklistByIdUser(correlationId, id) {
				return await LibraryClientUtility.$store.requestChecklistsShared(correlationId, id);
			},
			async requestChecklistsShared(correlationId, params) {
				return await LibraryClientUtility.$store.requestChecklistsShared(correlationId, params);
			},
			async requestChecklistsUser(correlationId, params) {
				return await LibraryClientUtility.$store.requestChecklistsUser(correlationId, params);
			},
			async requestContent(correlationId) {
				return await LibraryClientUtility.$store.requestContent(correlationId);
			},
			async requestContentMarkup(correlationId, contentId) {
				return await LibraryClientUtility.$store.requestContentMarkup(correlationId, contentId);
			},
			async requestManufacturers(correlationId) {
				return await LibraryClientUtility.$store.requestManufacturers(correlationId);
			},
			async requestMotor(correlationId, motorId) {
				return await LibraryClientUtility.$store.requestMotor(correlationId, motorId);
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
			async requestRocketById(correlationId, id) {
				return await LibraryClientUtility.$store.requestRocketById(correlationId, id);
			},
			async requestRocketByIdUser(correlationId, id) {
				return await LibraryClientUtility.$store.requestRocketByIdUser(correlationId, id);
			},
			async requestRocketsUser(correlationId, params) {
				return await LibraryClientUtility.$store.requestRocketsUser(correlationId, params);
			},
			async saveChecklistUser(correlationId, checklist) {
				return await LibraryClientUtility.$store.saveChecklistUser(correlationId, checklist);
			},
			async setChecklistShared(correlationId, rocket) {
				await LibraryClientUtility.$store.setChecklistShared(correlationId, value);
			},
			async setChecklistsShared(correlationId, rockets) {
				await LibraryClientUtility.$store.setChecklistsShared(correlationId, value);
			},
			async setChecklistsUser(correlationId, rockets) {
				await LibraryClientUtility.$store.setChecklistsUser(correlationId, value);
			},
			async setChecklistUser(correlationId, rocket) {
				await LibraryClientUtility.$store.setChecklistUser(correlationId, value);
			},
			async setOnline(correlationId, value) {
				await LibraryClientUtility.$store.setOnline(correlationId, value);
			},
			async setRocket(correlationId, rocket) {
				await LibraryClientUtility.$store.setRocket(correlationId, value);
			},
			async setRockets(correlationId, rockets) {
				await LibraryClientUtility.$store.setRockets(correlationId, value);
			},
			async setRocketsUser(correlationId, rockets) {
				await LibraryClientUtility.$store.setRocketsUser(correlationId, value);
			},
			async setRocketUser(correlationId, rocket) {
				await LibraryClientUtility.$store.setRocketUser(correlationId, value);
			}
		};
	}

	_initStoreConfigGetters() {
		return Object.assign(this._initStoreConfigGettersBase(), this._initStoreConfigGettersAdditional());
	}

	_initStoreConfigGettersAdditional() {
		return {};
	}

	_initStoreConfigGettersBase() {
		return {
			getContent() {
				return LibraryClientUtility.$store.content;
			},
			getContentInfo() {
				const temp = LibraryClientUtility.$store.content;
				if (!temp)
					return [];
				if (!temp.info)
					return [];
				if (this.mobileOnly)
					return temp.info.filter(l => l.mobile);
				return temp.info;
			},
			getContentTools() {
				const temp = LibraryClientUtility.$store.content;
				if (!temp)
					return [];
				if (!temp.tools)
					return [];
				if (this.mobileOnly)
					return temp.info.filter(l => l.mobile);
				return temp.tools;
			},
			getMotorSearchCriteria() {
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
		};
	}

	_initStoreConfigState() {
		return Object.assign(this._initStoreConfigStateBase(), this._initStoreConfigStateAdditional());
	}

	_initStoreConfigStateAdditional() {
		return {};
	}

	_initStoreConfigStateBase() {
		return {
			checklistsShared: [],
			checklistsSharedTtl: 0,
			checklistsSharedTtlDiff: 1000 * 60 * 30,
			checklistsUser: [],
			checksumLastUpdate: [],
			content: [],
			contentTtl: 0,
			contentTtlDiff: 1000 * 60 * 30,
			contentMarkup: [],
			contentMarkupTtl: 0,
			contentMarkupTtlDiff: 1000 * 60 * 30,
			manufacturers: [],
			manufacturersTtl: 0,
			manufacturersTtlDiff: 1000 * 60 * 30,
			mobileOnly: false,
			motorSearchCriteria: {},
			motorSearchResults: {},
			online: {},
			rockets: [],
			rocketsTtl: 0,
			rocketsTtlDiff: 1000 * 60 * 30,
			rocketsUser: [],
			thrust2weight: {},
			toolSettings: []
		};
	}

	_initStoreConfig() {
		return {
			state: () => (this._initStoreConfigState()),
			actions: this._initStoreConfigActions(),
			getters: this._initStoreConfigGetters(),
			dispatcher: this._initStoreConfigDispatchers()
		};
	}
}

export default AppStore;
