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
				paths: [ ...[
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
				const service = LibraryClientUtility.$injector.getService(LibraryClientConstants.InjectorKeys.SERVICE_UTILITY);
				const response = await service.content(correlationId);
				if (Response.hasSucceeded(response))
					await this.setContent(correlationId, response.results);
			},
			async requestChecklists(correlationId, force) {
				// TODO
				// const now = LibraryCommonUtility.getTimestamp();
				// const ttl = this.checklistsTtl ? this.checklistsTtl : 0;
				// const delta = now - ttl;
				// if (this.checklists && (delta <= this.checklistsTtlDiff))
				// 	return Response.success(correlationId, this.checklists);

				let fetch = force;
				if (!this.checklists)
					fetch = true;

				if (fetch) {
					const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_CHECKLISTS);
					const response = await service.listing(correlationId, {});
					this.$logger.debug('store', 'requestChecklists', 'response', response, correlationId);
					if (Response.hasSucceeded(response)) {
						this.setChecklists(correlationId, response.results.data);
					}
				}

				// TODO: filtering...

				return Response.success(correlationId, this.checklists ? this.checklists : []);
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
					this.setManufacturers(correlationId, response.results.data);
					return Response.success(correlationId, this.manufacturers);
				}

				return Response.success(correlationId, []);
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
				if (this.online) {
					const response = await service.search(correlationId, criteria, this.motorSearchResults);
					this.$logger.debug('store', 'requestMotorSearchResults', 'response', response, correlationId);
					if (Response.hasSucceeded(response)) {
						this.motorSearchResults = response.results.data;
						return response.results.filtered;
					}
				}

				return service.searchFilter(correlationId, this.motorSearchResults ? this.motorSearchResults : []);
			},
			async requestRockets(correlationId, params) {
				// const now = LibraryCommonUtility.getTimestamp();
				// const ttlContent = this.rocketsTtl ? this.rocketsTtl : 0;
				// const delta = now - ttlContent;
				// if (this.rocketsg && (delta <= this.rocketsTtlDiff))
				// 	return Response.success(correlationId, this.rockets);

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.listing(correlationId, params);
				this.$logger.debug('store', 'requestRockets', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setRockets(correlationId, response.results.data);
					return Response.success(correlationId, this.rockets);
				}

				return Response.success(correlationId, []);
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

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.retrieve(correlationId, id);
				this.$logger.debug('store', 'requestRocketsById', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setRocket(correlationId, response.results);
					return Response.success(correlationId, response.results);
				}

				return Response.success(correlationId, null);
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

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.retrieveUser(correlationId, id);
				this.$logger.debug('store', 'requestRocketsByIdUser', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setRocketUser(correlationId, response.results);
					return Response.success(correlationId, response.results);
				}

				return Response.success(correlationId, null);
			},
			async requestRocketsUser(correlationId, params) {
				let fetch = force;
				if (!this.checklists)
					fetch = true;

				if (fetch) {
					const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
					const response = await service.listingUser(correlationId, params);
					this.$logger.debug('store', 'requestRocketsUser', 'response', response, correlationId);
					if (Response.hasSucceeded(response)) {
						await this.setRocketsUser(correlationId, response.results.data);
					}
				}

				// TODO: filtering...

				return Response.success(correlationId, this.rocketsUser ? this.rocketsUser : []);
			},
			async setChecklists(correlationId, checklists) {
				this.$logger.debug('store', 'setChecklists', 'checklists.a', checklists, correlationId);
				this.$logger.debug('store', 'setChecklists', 'checklists.b', this.checklists, correlationId);
				this.checklists = checklists;
				this.$logger.debug('store', 'setChecklists', 'checklists.c', this.checklists, correlationId);
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
			async setManufacturers(correlationId, manufacturers) {
				this.$logger.debug('store', 'setManufacturers', 'manufacturers.a', manufacturers, correlationId);
				this.$logger.debug('store', 'setManufacturers', 'manufacturers.b', this.manufacturers, correlationId);
				this.manufacturers = manufacturers;
				this.$logger.debug('store', 'setManufacturers', 'manufacturers.c', this.manufacturers, correlationId);
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
			async setRockets(correlationId, rockets) {
				this.$logger.debug('store', 'setRockets', 'rockets.a', rockets, correlationId);
				this.$logger.debug('store', 'setRockets', 'rockets.b', this.rockets, correlationId);
				this.rockets = rockets;
				this.rocketsTtl = LibraryCommonUtility.getTimestamp();
				this.$logger.debug('store', 'setRockets', 'rockets.c', this.rockets, correlationId);
			},
			async setRocketsUser(correlationId, rockets) {
				this.$logger.debug('store', 'setRocketsUser', 'rockets.a', rockets, correlationId);
				this.$logger.debug('store', 'setRocketsUser', 'rocketsUser.b', this.rocketsUser, correlationId);
				this.rocketsUser = rockets;
				this.$logger.debug('store', 'setRocketsUser', 'rocketsUser.c', this.rocketsUser, correlationId);
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
			async requestChecklists(correlationId, force) {
				return await LibraryClientUtility.$store.requestChecklists(correlationId);
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
			async requestRocketsById(correlationId, id) {
				return await LibraryClientUtility.$store.requestRocketsById(correlationId, id);
			},
			async requestRocketsByIdUser(correlationId, id) {
				return await LibraryClientUtility.$store.requestRocketsByIdUser(correlationId, id);
			},
			async requestRocketsUser(correlationId, params) {
				return await LibraryClientUtility.$store.requestRocketsUser(correlationId, params);
			},
			async setOnline(correlationId, value) {
				await LibraryClientUtility.$store.setOnline(correlationId, value);
			},
			async setRocket(correlationId, rocket) {
				await LibraryClientUtility.$store.setRocket(correlationId, value);
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
