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
			_checkTtl(array, delta, diff) {
				return (array && Array.isArray(array) && (array.length) > 0 && (delta <= diff));
			},
			async copyChecklistById(correlationId, id) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_CHECKLISTS);
				const response = await service.copy(correlationId, id);
				this.$logger.debug('store', 'copyChecklistById', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setChecklist(correlationId, response.results);
					return Response.success(correlationId, response.results);
				}

				return Response.error('store', 'copyChecklistById', null, null, null, null, correlationId);
			},
			async copyPartById(correlationId, id) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_PARTS);
				const response = await service.copy(correlationId, id);
				this.$logger.debug('store', 'copyPartById', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setPart(correlationId, response.results);
					return Response.success(correlationId, response.results);
				}

				return Response.error('store', 'copyParttById', null, null, null, null, correlationId);
			},
			async deleteChecklist(correlationId, id) {
				this.$logger.debug('store', 'deleteChecklist', 'checklist.a', id, correlationId);
				this.$logger.debug('store', 'deleteChecklist', 'checklist.b', this.checklists, correlationId);
				this.checklists = LibraryCommonUtility.removeArrayById(this.checklists, id);
				this.$logger.debug('store', 'deleteChecklist', 'checklist.c', this.checklists, correlationId);
			},
			async deleteChecklistById(correlationId, id) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_CHECKLISTS);
				const response = await service.deleteUser(correlationId, id);
				this.$logger.debug('store', 'deleteChecklistById', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.deleteChecklistUser(correlationId, id);
					return Response.success(correlationId, response.results);
				}

				return Response.error('store', 'deleteChecklistById', null, null, null, null, correlationId);
			},
			async deletePart(correlationId, id) {
				this.$logger.debug('store', 'deletePart', 'part.a', id, correlationId);
				this.$logger.debug('store', 'deletePart', 'parts.b', this.parts, correlationId);
				this.parts = LibraryCommonUtility.removeArrayById(this.parts, id);
				this.$logger.debug('store', 'deletePart', 'parts.c', this.parts, correlationId);
			},
			async deletePartById(correlationId, id) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_PARTS);
				const response = await service.delete(correlationId, id);
				this.$logger.debug('store', 'deletePartById', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.deletePart(correlationId, id);
					return Response.success(correlationId, response.results);
				}

				return Response.error('store', 'deletePartById', null, null, null, null, correlationId);
			},
			async requestChecklistById(correlationId, id) {
				// let checklist = null;
				// if (this.checklists)
				// 	checklist = this.checklists.find(l => l.id === id);
				// if (checklist)
				// 	return Response.success(correlationId, checklist);

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_CHECKLISTS);
				const response = await service.retrieve(correlationId, id);
				this.$logger.debug('store', 'requestChecklistById', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setChecklist(correlationId, response.results);
					return Response.success(correlationId, response.results);
				}

				return Response.error('store', 'requestChecklistById', null, null, null, null, correlationId);
			},
			async requestChecklists(correlationId, params) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_CHECKLISTS);
				const response = await service.listing(correlationId, params);
				this.$logger.debug('store', 'requestChecklists', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setChecklists(correlationId, response.results.data);
					return Response.success(correlationId, this.checklists);
				}

				return Response.error('store', 'requestChecklists', null, null, null, null, correlationId);
			},
			async requestContent(correlationId) {
				const now = LibraryCommonUtility.getTimestamp();
				const ttlContent = this.contentTtl ? this.contentTtl : 0;
				const delta = now - ttlContent;
				// if (this.content && (this.content.length > 0) && (delta <= this.contentTtlDiff))
				if (this._checkTtl(this.content, delta, this.contentTtlDiff))
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
				// if (this.contentMarkup && (this.contentMarkup.length > 0) && (delta <= this.contentMarkupTtlDiff)) {
					if (this._checkTtl(this.contentMarkup, delta, this.contentMarkupTtlDiff)) {
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
				const now = LibraryCommonUtility.getTimestamp();
				const ttl = this.manufacturersTtl ? this.manufacturersTtl : 0;
				const delta = now - ttl;
				// if (this.manufacturers && (this.manufacturers.length) > 0 && (delta <= this.manufacturersTtlDiff))
				if (this._checkTtl(this.manufacturers, delta, this.manufacturersTtlDiff))
					return Response.success(correlationId, this.manufacturers);

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_MANUFACTURERS);
				const response = await service.listing(correlationId, {});
				this.$logger.debug('store', 'requestManufacturers', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					this.setManufacturers(correlationId, response.results.data);
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
			async requestParts(correlationId, params) {
				// const now = LibraryCommonUtility.getTimestamp();
				// const ttlContent = this.partsTtl ? this.partsTtl : 0;
				// const delta = now - ttlContent;
				// if (this.parts && (this.parts.length > 0) && (delta <= this.partsTtlDiff))
				// if (this._checkTtl(this.parts, delta, this.partsTtlDiff))
				// 	return Response.success(correlationId, this.parts);

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_PARTS);
				const response = await service.listing(correlationId, params);
				this.$logger.debug('store', 'requestParts', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setParts(correlationId, response.results.data);
					return Response.success(correlationId, this.parts);
				}

				return Response.error('store', 'requestParts', null, null, null, null, correlationId);
			},
			async requestPartById(correlationId, id) {
				let part = null;
				if (this.parts)
					part = this.parts.find(l => l.id === id);
				if (part && part.createdTimestamp)
					return Response.success(correlationId, part);

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_PARTS);
				const response = await service.retrieve(correlationId, id);
				this.$logger.debug('store', 'requestPartById', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setPart(correlationId, response.results);
					return Response.success(correlationId, response.results);
				}

				return Response.error('store', 'requestPartById', null, null, null, null, correlationId);
			},
			async requestRocketById(correlationId, id) {
				// const now = LibraryCommonUtility.getTimestamp();
				// const ttlContent = this.rocketsTtl ? this.rocketsTtl : 0;
				// const delta = now - ttlContent;
				// if (this.rockets && (this.rockets.length > 0) && (delta <= this.rocketsTtlDiff))
				// if (this._checkTtl(this.rockets, delta, this.rocketsTtlDiff))
				// 	return Response.success(correlationId, this.rockets);

				// let rocket = null;
				// if (this.rockets)
				// 	rocket = this.rockets.find(l => l.id === id);
				// if (rocket && rocket.createdTimestamp)
				// 	return Response.success(correlationId, rocket);

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.retrieve(correlationId, id);
				this.$logger.debug('store', 'requestRocketById', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setRocket(correlationId, response.results);
					return Response.success(correlationId, response.results);
				}

				return Response.error('store', 'requestRocketById', null, null, null, null, correlationId);
			},
			async requestRocketByIdGallery(correlationId, id) {
				let rocket = null;
				if (this.rocketsGallery)
					rocket = this.rocketsGallery.find(l => l.id === id);
				if (rocket && rocket.createdTimestamp)
					return Response.success(correlationId, rocket);

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.retrieveGallery(correlationId, id);
				this.$logger.debug('store', 'requestRocketByIdGallery', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setRocketGallery(correlationId, response.results);
					return Response.success(correlationId, response.results);
				}

				return Response.error('store', 'requestRocketByIdGallery', null, null, null, null, correlationId);
			},
			async requestRockets(correlationId, params) {
				// const now = LibraryCommonUtility.getTimestamp();
				// const ttlContent = this.rocketsTtl ? this.rocketsTtl : 0;
				// const delta = now - ttlContent;
				// if (this.rockets && (this.rockets.length > 0) && (delta <= this.rocketsTtlDiff))
				// if (this._checkTtl(this.rockets, delta, this.rocketsTtlDiff))
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
			async requestRocketsGallery(correlationId, params) {
				const now = LibraryCommonUtility.getTimestamp();
				const ttlContent = this.rocketsGalleryTtl ? this.rocketsGalleryTtl : 0;
				const delta = now - ttlContent;
				// if (this.rocketsGallery && (this.rocketsGallery.length > 0) && (delta <= this.rocketsGalleryTtlDiff))
				if (this._checkTtl(this.rocketsGallery, delta, this.rocketsGalleryTtlDiff))
					return Response.success(correlationId, this.rocketsGallery);

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.listingGallery(correlationId, params);
				this.$logger.debug('store', 'requestRocketsGallery', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setRocketsGallery(correlationId, response.results.data);
					return Response.success(correlationId, this.rocketsGallery);
				}

				return Response.error('store', 'requestRocketsGallery', null, null, null, null, correlationId);
			},
			async saveChecklist(correlationId, checklist) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_CHECKLISTS);
				const response = await service.save(correlationId, checklist);
				this.$logger.debug('store', 'saveChecklist', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setChecklist(correlationId, response.results);
					return Response.success(correlationId, response.results);
				}

				return Response.error('store', 'saveChecklist', null, null, null, null, correlationId);
			},
			async savePart(correlationId, part) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_PARTS);
				const response = await service.save(correlationId, part);
				this.$logger.debug('store', 'savePart', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setPart(correlationId, response.results);
					return Response.success(correlationId, response.results);
				}

				return Response.error('store', 'savePart', null, null, null, null, correlationId);
			},
			async saveRocket(correlationId, rocket) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.save(correlationId, rocket);
				this.$logger.debug('store', 'saveRocket', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setChecklist(correlationId, response.results);
					return Response.success(correlationId, response.results);
				}

				return Response.error('store', 'saveRocket', null, null, null, null, correlationId);
			},
			async setChecklists(correlationId, value) {
				this.$logger.debug('store', 'setChecklists', 'checklists.a', value, correlationId);
				this.$logger.debug('store', 'setChecklists', 'checklists.b', this.checklists, correlationId);
				this.checklists = value;
				this.$logger.debug('store', 'setChecklists', 'checklists.c', this.checklists, correlationId);
			},
			async setChecklist(correlationId, value) {
				this.$logger.debug('store', 'setChecklist', 'checklist.a', value, correlationId);
				this.$logger.debug('store', 'setChecklist', 'checklists.b', this.checklists, correlationId);
				this.checklists = LibraryCommonUtility.updateArrayByObject(this.checklists, value);
				this.$logger.debug('store', 'setChecklist', 'checklists.c', this.checklists, correlationId);
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
			async setManufacturers(correlationId, value) {
				this.$logger.debug('store', 'setManufacturers', 'manufacturers.a', value, correlationId);
				this.$logger.debug('store', 'setManufacturers', 'manufacturers.b', this.manufacturers, correlationId);
				this.manufacturers = value;
				this.manufacturersTtl = LibraryCommonUtility.getTimestamp();
				this.$logger.debug('store', 'setManufacturers', 'manufacturers.c', this.manufacturers, correlationId);
			},
			async setMotorSearchCriteria(correlationId, value) { 
			},
			async setOnline(correlationId, online) {
				this.$logger.debug('store', 'setOnline', 'online.a', online, correlationId);
				this.$logger.debug('store', 'setOnline', 'online.b', this.online, correlationId);
				this.online = online;
				this.$logger.debug('store', 'setOnline', 'online.c', this.online, correlationId);
			},
			async setPart(correlationId, value) {
				this.$logger.debug('store', 'setPart', 'parts.a', value, correlationId);
				this.$logger.debug('store', 'setPart', 'parts.b', this.parts, correlationId);
				this.parts = LibraryCommonUtility.updateArrayByObject(this.parts, value);
				this.$logger.debug('store', 'setPart', 'parts.c', this.parts, correlationId);
			},
			async setParts(correlationId, value) {
				this.$logger.debug('store', 'setParts', 'parts.a', value, correlationId);
				this.$logger.debug('store', 'setParts', 'parts.b', this.parts, correlationId);
				this.parts = value;
				this.partsTtl = LibraryCommonUtility.getTimestamp();
				this.$logger.debug('store', 'setParts', 'parts.c', this.parts, correlationId);
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
			async setRocketsGallery(correlationId, value) {
				this.$logger.debug('store', 'setRocketsGallery', 'rockets.a', value, correlationId);
				this.$logger.debug('store', 'setRocketsGallery', 'rocketsGallery.b', this.rocketsGallery, correlationId);
				this.rocketsGallery = value;
				this.rocketsGalleryTtl = LibraryCommonUtility.getTimestamp();
				this.$logger.debug('store', 'setRocketsGallery', 'rocketsGallery.c', this.rocketsGallery, correlationId);
			},
			async setRocketGallery(correlationId, value) {
				this.$logger.debug('store', 'setRocketGallery', 'rocket.a', value, correlationId);
				this.$logger.debug('store', 'setRocketGallery', 'rocketsGallery.b', this.rocketsGallery, correlationId);
				this.rocketsGallery = LibraryCommonUtility.updateArrayByObject(this.rocketsGallery, value);
				this.rocketsGalleryTtl = LibraryCommonUtility.getTimestamp();
				this.$logger.debug('store', 'setRocketGallery', 'rocketsGallery.c', this.rocketsGallery, correlationId);
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
			async copyChecklistById(correlationId, id) {
				return await LibraryClientUtility.$store.copyChecklistById(correlationId, id);
			},
			async copyPartById(correlationId, id) {
				return await LibraryClientUtility.$store.copyPartById(correlationId, id);
			},
			async deleteChecklistById(correlationId, id) {
				return await LibraryClientUtility.$store.deleteChecklistById(correlationId, id);
			},
			async deletePartById(correlationId, id) {
				return await LibraryClientUtility.$store.deletePartById(correlationId, id);
			},
			async requestChecklistById(correlationId, id) {
				return await LibraryClientUtility.$store.requestChecklistById(correlationId, id);
			},
			async requestChecklists(correlationId, params) {
				return await LibraryClientUtility.$store.requestChecklists(correlationId, params);
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
			async requestPartById(correlationId, id) {
				return await LibraryClientUtility.$store.requestPartById(correlationId, id);
			},
			async requestParts(correlationId, params) {
				return await LibraryClientUtility.$store.requestParts(correlationId, params);
			},
			async requestRocketById(correlationId, id) {
				return await LibraryClientUtility.$store.requestRocketById(correlationId, id);
			},
			async requestRocketByIdGallery(correlationId, id) {
				return await LibraryClientUtility.$store.requestRocketByIdGallery(correlationId, id);
			},
			async requestRockets(correlationId, params) {
				return await LibraryClientUtility.$store.requestRockets(correlationId, params);
			},
			async requestRocketsGallery(correlationId, params) {
				return await LibraryClientUtility.$store.requestRocketsGallery(correlationId, params);
			},
			async saveChecklist(correlationId, checklist) {
				return await LibraryClientUtility.$store.saveChecklist(correlationId, checklist);
			},
			async savePart(correlationId, part) {
				return await LibraryClientUtility.$store.savePart(correlationId, part);
			},
			async saveRocket(correlationId, rocket) {
				return await LibraryClientUtility.$store.saveRocket(correlationId, rocket);
			},
			async setMotorSearchCriteria(correlationId, value) {
				await LibraryClientUtility.$store.setMotorSearchCriteria(correlationId, value);
			},
			async setMotorSearchResults(correlationId, value) {
				await LibraryClientUtility.$store.setMotorSearchResults(correlationId, value);
			},
			async setOnline(correlationId, value) {
				await LibraryClientUtility.$store.setOnline(correlationId, value);
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
				if (LibraryClientUtility.$store.mobileOnly)
					return temp.info.filter(l => l.mobile);
				return temp.info;
			},
			getContentTools() {
				const temp = LibraryClientUtility.$store.content;
				if (!temp)
					return [];
				if (!temp.tools)
					return [];
				if (LibraryClientUtility.$store.mobileOnly)
					return temp.tools.filter(l => l.mobile);
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
			getRocketsGallery() {
				return LibraryClientUtility.$store.rocketsGallery;
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
			checklists: [],
			checkliststTtl: 0,
			checklistsTtlDiff: 1000 * 60 * 30,
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
			parts: [],
			partsTtl: 0,
			partsTtlDiff: 1000 * 60 * 30,
			rockets: [],
			rocketsGallery: [],
			rocketsGalleryTtl: 0,
			rocketsGalleryTtlDiff: 1000 * 60 * 30,
			rocketsTtl: 0,
			rocketsTtlDiff: 1000 * 60 * 30,
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
