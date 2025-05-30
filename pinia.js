import AppCommonConstants from 'rocket_sidekick_common/constants';
import AppSharedConstants from '@/utility/constants';
import LibraryClientConstants from '@thzero/library_client/constants.js';

import LibraryClientUtility from '@thzero/library_client/utility/index';
import LibraryCommonUtility from '@thzero/library_common/utility';
import LibraryMomentUtility from '@thzero/library_common/utility/moment';

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
					...this._initPluginPersistConfigPathsMotorSearch()
				]
			}
		};
	}

	_initPluginPersistConfigPaths() {
		return [
			'checklistsSearchCriteria',
			'inventoryExpanded',
			'inventorySettings',
			'launchesSettings',
			'locationsExpanded',
			'locationsSearchCriteria',
			'manufacturers',
			'parts',
			'partsRocketSearchCriteria',
			'partsSearchCriteria',
			'rocketsExpanded',
			'rocketSetupsExpanded',
			'rocketsSearchCriteria'
		];
	}

	_initPluginPersistConfigPathsTtl() {
		return [
			'manufacturersTtl'
		];
	}

	_initPluginPersistConfigPathsMotorSearch() {
		return [
			'motorSearchCriteria',
			'motorSearchResults'
		];
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
				if (Response.hasSucceeded(response))
					await this.setChecklist(correlationId, response.results);
				return response;
			},
			async copyPartById(correlationId, id) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_PARTS);
				const response = await service.copy(correlationId, id);
				this.$logger.debug('store', 'copyPartById', 'response', response, correlationId);
				if (Response.hasSucceeded(response))
					await this.setPart(correlationId, response.results);
				return response;
			},
			async deleteChecklist(correlationId, id) {
				this.$logger.debug('store', 'deleteChecklist', 'checklist.a', id, correlationId);
				this.$logger.debug('store', 'deleteChecklist', 'checklist.b', this.checklists, correlationId);
				this.checklists = LibraryCommonUtility.deleteArrayById(this.checklists, id);
				this.$logger.debug('store', 'deleteChecklist', 'checklist.c', this.checklists, correlationId);
			},
			async deleteChecklistById(correlationId, id) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_CHECKLISTS);
				const response = await service.delete(correlationId, id);
				this.$logger.debug('store', 'deleteChecklistById', 'response', response, correlationId);
				if (Response.hasSucceeded(response))
					await this.deleteChecklist(correlationId, id);
				return response;
			},
			async deleteLaunch(correlationId, id) {
				this.$logger.debug('store', 'deleteLaunch', 'launches.a', id, correlationId);
				this.$logger.debug('store', 'deleteLaunch', 'launches.b', this.launches, correlationId);
				this.launches = LibraryCommonUtility.deleteArrayById(this.launches, id);
				this.$logger.debug('store', 'deleteLaunch', 'launches.c', this.launches, correlationId);
			},
			async deleteLaunchById(correlationId, id) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_LAUNCHES);
				const response = await service.delete(correlationId, id);
				this.$logger.debug('store', 'deleteLaunchById', 'response', response, correlationId);
				if (Response.hasSucceeded(response))
					await this.deleteLaunch(correlationId, id);
				return response;
			},
			async deleteLocation(correlationId, id) {
				this.$logger.debug('store', 'deleteLocation', 'locations.a', id, correlationId);
				this.$logger.debug('store', 'deleteLocation', 'locations.b', this.locations, correlationId);
				this.locations = LibraryCommonUtility.deleteArrayById(this.locations, id);
				this.$logger.debug('store', 'deleteLocation', 'locations.c', this.locations, correlationId);
			},
			async deleteLocationById(correlationId, id) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_LOCATIONS);
				const response = await service.delete(correlationId, id);
				this.$logger.debug('store', 'deleteLocationById', 'response', response, correlationId);
				if (Response.hasSucceeded(response))
					await this.deleteLocation(correlationId, id);
				return response;
			},
			async deletePart(correlationId, id) {
				this.$logger.debug('store', 'deletePart', 'part.a', id, correlationId);
				this.$logger.debug('store', 'deletePart', 'parts.b', this.parts, correlationId);
				this.parts = LibraryCommonUtility.deleteArrayById(this.parts, id);
				this.$logger.debug('store', 'deletePart', 'parts.c', this.parts, correlationId);
			},
			async deletePartById(correlationId, id) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_PARTS);
				const response = await service.delete(correlationId, id);
				this.$logger.debug('store', 'deletePartById', 'response', response, correlationId);
				if (Response.hasSucceeded(response))
					await this.deletePart(correlationId, id);
				return response;
			},
			async deleteRocket(correlationId, id) {
				this.$logger.debug('store', 'deleteRocket', 'rocket.a', id, correlationId);
				this.$logger.debug('store', 'deleteRocket', 'rockets.b', this.rockets, correlationId);
				this.rockets = LibraryCommonUtility.deleteArrayById(this.rockets, id);
				this.$logger.debug('store', 'deleteRocket', 'rockets.c', this.rockets, correlationId);
			},
			async deleteRocketById(correlationId, id) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.delete(correlationId, id);
				this.$logger.debug('store', 'deleteRocketById', 'response', response, correlationId);
				if (Response.hasSucceeded(response))
					await this.deleteRocket(correlationId, id);
				return response;
			},
			async deleteRocketSetup(correlationId, id) {
				this.$logger.debug('store', 'deleteRocketSetup', 'rocketSetup.a', id, correlationId);
				this.$logger.debug('store', 'deleteRocketSetup', 'rocketSetups.b', this.rocketSetups, correlationId);
				this.rocketSetups = LibraryCommonUtility.deleteArrayById(this.rocketSetups, id);
				this.$logger.debug('store', 'deleteRocketSetup', 'rocketSetups.c', this.rocketSetups, correlationId);
			},
			async deleteRocketSetupById(correlationId, id) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETSETUPS);
				const response = await service.delete(correlationId, id);
				this.$logger.debug('store', 'deleteRocketSetupById', 'response', response, correlationId);
				if (Response.hasSucceeded(response))
					await this.deleteRocketSetup(correlationId, id);
				return response;
			},
			async requestChecklistById(correlationId, id, editable) {
				// let checklist = null;
				// if (this.checklists)
				// 	checklist = this.checklists.find(l => l.id === id);
				// if (checklist)
				// 	return Response.success(correlationId, checklist);

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_CHECKLISTS);
				const response = await service.retrieve(correlationId, id);
				this.$logger.debug('store', 'requestChecklistById', 'response', response, correlationId);
				// if (editable && Response.hasSucceeded(response))
				// 	await this.setChecklist(correlationId, response.results);
				return response;
			},
			async requestChecklists(correlationId, params) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_CHECKLISTS);
				const response = await service.search(correlationId, params);
				this.$logger.debug('store', 'requestChecklists', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setChecklists(correlationId, response.results.data);
					return Response.success(correlationId, this.checklists);
				}

				return response;
			},
			async requestContent(correlationId) {
				const now = LibraryMomentUtility.getTimestamp();
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

				// return Response.error('store', 'requestContent', null, null, null, null, correlationId);
				return response;
			},
			async requestContentMarkup(correlationId, contentId) {
				if (String.isNullOrEmpty(contentId))
					return Response.error('store', 'requestContentMarkup', 'contentId', null, null, null, correlationId);

				const now = LibraryMomentUtility.getTimestamp();
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
				if (Response.hasSucceeded(response))
					this.setContentMarkup(correlationId, response.results);
				return response;
			},
			async requestCountries(correlationId) {
				// TODO
				const now = LibraryMomentUtility.getTimestamp();
				const ttl = this.countriesTtl ? this.countriesTtl : 0;
				const delta = now - ttl;
				// if (this.countries && (this.countries.length) > 0 && (delta <= this.countriesTtlDiff))
				if (this._checkTtl(this.countries, delta, this.countriessTtlDiff))
					return Response.success(correlationId, this.countries);

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_COUNTRIES);
				const response = await service.listing(correlationId, {});
				this.$logger.debug('store', 'requestCountries', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					this.setCountries(correlationId, response.results.data);
					return Response.success(correlationId, this.countries);
				}

				return response;
			},
			async requestInventory(correlationId, params) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_INVENTORY);
				const response = await service.retrieve(correlationId);
				this.$logger.debug('store', 'requestInventory', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setInventory(correlationId, response.results);
					return Response.success(correlationId, this.inventory);
				}

				// return Response.error('store', 'requestInventory', null, null, null, null, correlationId);
				return response;
			},
			async requestLaunchById(correlationId, id, editable) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_LAUNCHES);
				const response = await service.retrieve(correlationId, id);
				this.$logger.debug('store', 'requestLaunchById', 'response', response, correlationId);
				// if (editable && Response.hasSucceeded(response))
				// 	await this.setLaunch(correlationId, response.results);
				return response;
			},
			async requestLaunches(correlationId, params) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_LAUNCHES);
				const response = await service.search(correlationId, params);
				this.$logger.debug('store', 'requestLaunches', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setLaunches(correlationId, response.results.data);
					return Response.success(correlationId, this.launches);
				}

				// return Response.error('store', 'requestLaunches', null, null, null, null, correlationId);
				return response;
			},
			async requestLocationById(correlationId, id, editable) {
				// TODO
				const now = LibraryMomentUtility.getTimestamp();
				const ttl = this.locationsTtl ? this.locationsTtl : 0;
				const delta = now - ttl;
				// if (this.locations && (this.locations.length) > 0 && (delta <= this.locationsTtlDiff))
				if (this._checkTtl(this.locations, delta, this.locationsTtlDiff)) {
					const location = this.locations.find(l => l.id === id);
					if (location && location.iterations)
						return Response.success(correlationId, location);
				}

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_LOCATIONS);
				const response = await service.retrieve(correlationId, id);
				this.$logger.debug('store', 'requestLocationById', 'response', response, correlationId);
				// if (editable && Response.hasSucceeded(response))
				// 	await this.setLocation(correlationId, response.results);
				return response;
			},
			async requestLocations(correlationId, params) {
				// TODO
				const now = LibraryMomentUtility.getTimestamp();
				const ttl = this.locationsTtl ? this.locationsTtl : 0;
				const delta = now - ttl;
				// if (this.locations && (this.locations.length) > 0 && (delta <= this.locationsTtlDiff))
				if (this._checkTtl(this.locations, delta, this.locationsTtlDiff))
					return Response.success(correlationId, this.locations);

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_LOCATIONS);
				const response = await service.search(correlationId, params);
				this.$logger.debug('store', 'requestLocations', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setLocations(correlationId, response.results.data);
					return Response.success(correlationId, this.locations);
				}

				// return Response.error('store', 'requestLocations', null, null, null, null, correlationId);
				return response;
			},
			async requestManufacturers(correlationId) {
				// TODO
				const now = LibraryMomentUtility.getTimestamp();
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
					return Response.success(correlationId, this.manufacturers);
				}

				return response;
			},
			async requestMotor(correlationId, motorId) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_MOTORS);
				const response = await service.motor(correlationId, motorId, this.motorSearchResults);
				this.$logger.debug('store', 'requestMotor', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					this.setMotorSearchResults(correlationId, response.results.data);
					return Response.success(correlationId, response.results.motor);
				}

				// return Response.error('store', 'requestMotor', null, null, null, null, correlationId);
				return response;
			},
			async requestMotorSearch(correlationId, criteria) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_MOTORS);
				const response = await service.search(correlationId, criteria, this.motorSearchResults);
				this.$logger.debug('store', 'requestMotorSearch', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					this.setMotorSearchResults(correlationId, response.results.data);
					return response.results.filtered;
				}

				return response;
			},
			async requestMotorSearchReset(correlationId) {
				if (this.motorSearchResults) {
					this.motorSearchResults.ttl = null;
					this.motorSearchResults.last = null;
				}
			},
			async requestPartById(correlationId, id, editable) {
				let part = null;
				if (this.parts)
					part = this.parts.find(l => l.id === id);
				if (part && part.createdTimestamp)
					return Response.success(correlationId, part);

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_PARTS);
				const response = await service.retrieve(correlationId, id);
				this.$logger.debug('store', 'requestPartById', 'response', response, correlationId);
				// if (editable && Response.hasSucceeded(response))
				// 	await this.setPart(correlationId, response.results);
				return response;
			},
			async requestParts(correlationId, params) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_PARTS);
				const response = await service.search(correlationId, params, this.parts);
				this.$logger.debug('store', 'requestParts', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setParts(correlationId, response.results.data);
					return Response.success(correlationId, response.results.data);
				}

				// return Response.error('store', 'requestParts', null, null, null, null, correlationId);
				return response;
			},
			async requestPartsRocketSearchReset(correlationId) {
				this.setPartsRocketSearchResults(correlationId, []);
			},
			async requestPartsRocketSearch(correlationId, criteria) {
				const isMotor = criteria.partTypes.find(l => l === AppCommonConstants.Rocketry.PartTypes.motor);
				if (isMotor) {
					delete criteria.partTypes;
					return this.requestMotorSearch(correlationId, criteria);
				}

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_PARTS);
				const response = await service.searchRocket(correlationId, criteria, this.partsRocketSearchResults);
				this.$logger.debug('store', 'requestPartsRocketSearch', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					this.setPartsRocketSearchResults(correlationId, response.results.data);
					return response.results.data;
				}

				return response;
			},
			async requestRocketById(correlationId, id, editable) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.retrieve(correlationId, id);
				this.$logger.debug('store', 'requestRocketById', 'response', response, correlationId);
				// if (editable && Response.hasSucceeded(response))
				// 	await this.setRocket(correlationId, response.results);
				return response;
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
				if (Response.hasSucceeded(response))
					await this.setRocketGallery(correlationId, response.results);
				return response;
			},
			async requestRocketSetupById(correlationId, id, editable) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETSETUPS);
				const response = await service.retrieve(correlationId, id);
				this.$logger.debug('store', 'requestRocketSetupById', 'response', response, correlationId);
				// if (editable && Response.hasSucceeded(response))
				// 	await this.setRocketSetup(correlationId, response.results);
				return response;
			},
			async requestRockets(correlationId, params) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.search(correlationId, params);
				this.$logger.debug('store', 'requestRockets', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setRockets(correlationId, response.results.data);
					return Response.success(correlationId, this.rockets);
				}

				return response;
			},
			async requestRocketsGallery(correlationId, params) {
				const now = LibraryMomentUtility.getTimestamp();
				const ttlContent = this.rocketsGalleryTtl ? this.rocketsGalleryTtl : 0;
				const delta = now - ttlContent;
				// if (this.rocketsGallery && (this.rocketsGallery.length > 0) && (delta <= this.rocketsGalleryTtlDiff))
				if (this._checkTtl(this.rocketsGallery, delta, this.rocketsGalleryTtlDiff))
					return Response.success(correlationId, this.rocketsGallery);

				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.searchGallery(correlationId, params);
				this.$logger.debug('store', 'requestRocketsGallery', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setRocketsGallery(correlationId, response.results.data);
					return Response.success(correlationId, this.rocketsGallery);
				}

				return response;
			},
			async requestRocketSetups(correlationId, params) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETSETUPS);
				const response = await service.search(correlationId, params);
				this.$logger.debug('store', 'requestRocketSetups', 'response', response, correlationId);
				if (Response.hasSucceeded(response)) {
					await this.setRocketSetups(correlationId, response.results.data);
					return Response.success(correlationId, this.rocketSetups);
				}

				return response;
			},
			async saveChecklist(correlationId, checklist) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_CHECKLISTS);
				const response = await service.save(correlationId, checklist);
				this.$logger.debug('store', 'saveChecklist', 'response', response, correlationId);
				if (Response.hasSucceeded(response))
					await this.setChecklist(correlationId, response.results);
				return response;
			},
			async saveInventory(correlationId, inventory) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_INVENTORY);
				const response = await service.save(correlationId, inventory);
				this.$logger.debug('store', 'saveInventory', 'response', response, correlationId);
				if (Response.hasSucceeded(response))
					await this.setInventory(correlationId, response.results);
				return response;
			},
			async saveLaunch(correlationId, launch) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_LAUNCHES);
				const response = await service.save(correlationId, launch);
				this.$logger.debug('store', 'saveLaunch', 'response', response, correlationId);
				if (Response.hasSucceeded(response))
					await this.setLaunch(correlationId, response.results);
				return response;
			},
			async saveLocation(correlationId, location) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_LOCATIONS);
				const response = await service.save(correlationId, location);
				this.$logger.debug('store', 'saveLocation', 'response', response, correlationId);
				if (Response.hasSucceeded(response))
					await this.setLocation(correlationId, response.results);
				return response;
			},
			async savePart(correlationId, part) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_PARTS);
				const response = await service.save(correlationId, part);
				this.$logger.debug('store', 'savePart', 'response', response, correlationId);
				if (Response.hasSucceeded(response))
					await this.setPart(correlationId, response.results);
				return response;
			},
			async saveRocket(correlationId, rocket) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.save(correlationId, rocket);
				this.$logger.debug('store', 'saveRocket', 'response', response, correlationId);
				return response;
			},
			async saveRocketStage(correlationId, rocket, stage) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.saveStage(correlationId, rocket, stage);
				this.$logger.debug('store', 'saveRocketStage', 'response', response, correlationId);
				return response;
			},
			async saveRocketStageDelete(correlationId, rocket, id) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.saveStageDelete(correlationId, rocket, id);
				this.$logger.debug('store', 'saveRocketStageDelete', 'response', response, correlationId);
				return response;
			},
			async saveRocketStagePart(correlationId, rocket, part) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.saveStagePart(correlationId, rocket, part);
				this.$logger.debug('store', 'saveRocketStagePart', 'response', response, correlationId);
				return response;
			},
			async saveRocketSetup(correlationId, rocketSetup) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETSETUPS);
				const response = await service.save(correlationId, rocketSetup);
				this.$logger.debug('store', 'saveRocketSetup', 'response', response, correlationId);
				return response;
			},
			async saveRocketSetupStage(correlationId, rocketSetup, stage) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETSETUPS);
				const response = await service.saveStage(correlationId, rocketSetup, stage);
				this.$logger.debug('store', 'saveRocketSetupStage', 'response', response, correlationId);
				return response;
			},
			async saveRocketSetupStageDelete(correlationId, rocketSetup, id) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETSETUPS);
				const response = await service.saveStageDelete(correlationId, rocketSetup, id);
				this.$logger.debug('store', 'saveRocketSetupStageDelete', 'response', response, correlationId);
				return response;
			},
			async saveRocketSetupStagePart(correlationId, rocketSetup, part) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETSETUPS);
				const response = await service.saveStagePart(correlationId, rocketSetup, part);
				this.$logger.debug('store', 'saveRocketSetupStagePart', 'response', response, correlationId);
				return response;
			},
			async saveRocketVideo(correlationId, rocket, stage) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.saveVideo(correlationId, rocket, stage);
				this.$logger.debug('store', 'saveRocketVideo', 'response', response, correlationId);
				return response;
			},
			async saveRocketVideoDelete(correlationId, rocket, id) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_ROCKETS);
				const response = await service.saveVideoDelete(correlationId, rocket, id);
				this.$logger.debug('store', 'saveRocketVideoDelete', 'response', response, correlationId);
				return response;
			},
			async setChecklist(correlationId, value) {
				this.$logger.debug('store', 'setChecklist', 'checklist.a', value, correlationId);
				this.$logger.debug('store', 'setChecklist', 'checklists.b', this.checklists, correlationId);
				this.checklists = LibraryCommonUtility.updateArrayByObject(this.checklists, value);
				this.$logger.debug('store', 'setChecklist', 'checklists.c', this.checklists, correlationId);
			},
			async setChecklists(correlationId, value) {
				this.$logger.debug('store', 'setChecklists', 'checklists.a', value, correlationId);
				this.$logger.debug('store', 'setChecklists', 'checklists.b', this.checklists, correlationId);
				this.checklists = value;
				this.$logger.debug('store', 'setChecklists', 'checklists.c', this.checklists, correlationId);
			},
			async setChecklistsSearchCriteria(correlationId, value) {
				this.checklistsSearchCriteria = value;
			},
			async setContent(correlationId, content) {
				this.$logger.debug('store', 'setContent', 'content.a', content, correlationId);
				this.$logger.debug('store', 'setContent', 'content.b', this.content, correlationId);
				this.content = content;
				this.contentTtl = LibraryMomentUtility.getTimestamp();
				this.$logger.debug('store', 'setContent', 'content.c', this.content, correlationId);
			},
			async setContentMarkup(correlationId, content) {
				this.$logger.debug('store', 'setContent', 'contentMarkup.a', content, correlationId);
				this.$logger.debug('store', 'setContent', 'contentMarkup.b', this.contentMarkup, correlationId);
				if (content && !String.isNullOrEmpty(content)) {
					this.contentMarkupTtl = LibraryMomentUtility.getTimestamp();
					LibraryCommonUtility.updateArrayByObject(this.contentMarkup, content);
				}
				this.$logger.debug('store', 'setContent', 'contentMarkup.c', this.contentMarkup, correlationId);
			},
			async setCountries(correlationId, value) {
				this.$logger.debug('store', 'setCountries', 'countries.a', value, correlationId);
				this.$logger.debug('store', 'setCountries', 'countries.b', this.countries, correlationId);
				this.countries = value;
				this.countriesTtl = LibraryMomentUtility.getTimestamp();
				this.$logger.debug('store', 'setCountries', 'countries.c', this.countries, correlationId);
			},
			async setInventory(correlationId, value) {
				this.$logger.debug('store', 'setInventory', 'inventory.a', value, correlationId);
				this.$logger.debug('store', 'setInventory', 'inventory.b', this.inventory, correlationId);
				this.inventory = value;
				this.inventoryTtl = LibraryMomentUtility.getTimestamp();
				this.$logger.debug('store', 'setInventory', 'inventory.c', this.inventory, correlationId);
			},
			async setInventoryExpanded(correlationId, value) {
				this.inventoryExpanded = value ?? [];
			},
			async setInventorySettings(correlationId, value) {
				this.inventorySettings = value;
			},
			async setLaunch(correlationId, value) {
				this.$logger.debug('store', 'setLaunch', 'launches.a', value, correlationId);
				this.$logger.debug('store', 'setLaunch', 'launches.b', this.launches, correlationId);
				this.launches = LibraryCommonUtility.updateArrayByObject(this.launches, value);
				this.launchesTtl = LibraryMomentUtility.getTimestamp();
				this.$logger.debug('store', 'setLaunch', 'launches.c', this.launches, correlationId);
			},
			async setLaunches(correlationId, value) {
				this.$logger.debug('store', 'setLaunches', 'launches.a', value, correlationId);
				this.$logger.debug('store', 'setLaunches', 'launches.b', this.launches, correlationId);
				this.launches = value;
				this.launchesTtl = LibraryMomentUtility.getTimestamp();
				this.$logger.debug('store', 'setLaunches', 'launches.c', this.launches, correlationId);
			},
			async setLaunchesSettings(correlationId, value) {
				this.launchesSettings = value;
			},
			async setLocation(correlationId, value) {
				this.$logger.debug('store', 'setLocation', 'locations.a', value, correlationId);
				this.$logger.debug('store', 'setLocation', 'locations.b', this.locations, correlationId);
				this.locations = LibraryCommonUtility.updateArrayByObject(this.locations, value);
				this.locationsTtl = LibraryMomentUtility.getTimestamp();
				this.$logger.debug('store', 'setLocation', 'locations.c', this.locations, correlationId);
			},
			async setLocations(correlationId, value) {
				this.$logger.debug('store', 'setLocations', 'locations.a', value, correlationId);
				this.$logger.debug('store', 'setLocations', 'locations.b', this.locations, correlationId);
				this.locations = value;
				this.locationsTtl = LibraryMomentUtility.getTimestamp();
				this.$logger.debug('store', 'setLocations', 'locations.c', this.locations, correlationId);
			},
			async setLocationsExpanded(correlationId, value) {
				if (!value || String.isNullOrEmpty(value.id))
					return;
				this.locationsExpanded[value.id] = value.expanded;
			},
			async setLocationsSearchCriteria(correlationId, value) {
				this.locationsSearchCriteria = value;
			},
			async setManufacturers(correlationId, value) {
				this.$logger.debug('store', 'setManufacturers', 'manufacturers.a', value, correlationId);
				this.$logger.debug('store', 'setManufacturers', 'manufacturers.b', this.manufacturers, correlationId);
				this.manufacturers = value;
				this.manufacturersTtl = LibraryMomentUtility.getTimestamp();
				this.$logger.debug('store', 'setManufacturers', 'manufacturers.c', this.manufacturers, correlationId);
			},
			async setMotorSearchCriteria(correlationId, value) {
				this.motorSearchCriteria = value;
			},
			async setMotorSearchResults(correlationId, value) {
				this.$logger.debug('store', 'setMotorSearchResults', 'motorSearchResults.a', value, correlationId);
				this.$logger.debug('store', 'setMotorSearchResults', 'motorSearchResults.b', this.motorSearchResults, correlationId);
				this.motorSearchResults = value;
				this.$logger.debug('store', 'setMotorSearchResults', 'motorSearchResults.c', this.motorSearchResults, correlationId);
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
				this.$logger.debug('store', 'setParts', 'parts.c', this.parts, correlationId);
			},
			async setPartsAltimetersSearchResults(correlationId, value) {
				this.$logger.debug('store', 'setPartsAltimetersSearchResults', 'partsAltimetersSearchResults.a', value, correlationId);
				this.$logger.debug('store', 'setPartsAltimetersSearchResults', 'partsAltimetersSearchResults.b', this.partsAltimetersSearchResults, correlationId);
				this.partsAltimetersSearchResults = value;
				this.$logger.debug('store', 'setPartsAltimetersSearchResults', 'partsAltimetersSearchResults.c', this.partsAltimetersSearchResults, correlationId);
			},
			async setPartsRocketSearchResults(correlationId, value) {
				this.$logger.debug('store', 'setPartsRocketSearchResults', 'partsRocketSearchResults.a', value, correlationId);
				this.$logger.debug('store', 'setPartsRocketSearchResults', 'partsRocketSearchResults.b', this.partsRocketSearchResults, correlationId);
				this.partsRocketSearchResults = value;
				this.$logger.debug('store', 'setPartsRocketSearchResults', 'partsRocketSearchResults.c', this.partsRocketSearchResults, correlationId);
			},
			async setPartsTrackersSearchResults(correlationId, value) {
				this.$logger.debug('store', 'setPartsTrackersSearchResults', 'partsTrackersSearchResults.a', value, correlationId);
				this.$logger.debug('store', 'setPartsTrackersSearchResults', 'partsTrackersSearchResults.b', this.partsTrackersSearchResults, correlationId);
				this.partsTrackersSearchResults = value;
				this.$logger.debug('store', 'setPartsTrackersSearchResults', 'partsTrackersSearchResults.c', this.partsTrackersSearchResults, correlationId);
			},
			async setPartsRocketSearchCriteria(correlationId, value) {
				if (!value)
					return;
				this.partsRocketSearchCriteria = this.partsRocketSearchCriteria ?? {};
				this.partsRocketSearchCriteria = value.params;
			},
			async setPartsSearchCriteria(correlationId, value) {
				if (!value)
					return;
				this.partsSearchCriteria = this.partsSearchCriteria ?? {};
				this.partsSearchCriteria[value.type] = this.partsSearchCriteria[value.type] ?? {};
				this.partsSearchCriteria[value.type] = value.params;
			},
			async setRocket(correlationId, value) {
				this.$logger.debug('store', 'setRocket', 'rocket.a', value, correlationId);
				this.$logger.debug('store', 'setRocket', 'rockets.b', this.rockets, correlationId);
				this.rockets = LibraryCommonUtility.updateArrayByObject(this.rockets, value);
				this.rocketsTtl = LibraryMomentUtility.getTimestamp();
				this.$logger.debug('store', 'setRocket', 'rockets.c', this.rockets, correlationId);
			},
			async setRocketSetup(correlationId, value) {
				this.$logger.debug('store', 'setRocketSetup', 'rocketSetups.a', value, correlationId);
				this.$logger.debug('store', 'setRocketSetup', 'rocketSetups.b', this.rocketSetups, correlationId);
				this.rocketSetups = LibraryCommonUtility.updateArrayByObject(this.rocketSetups, value);
				this.rocketSetupsTtl = LibraryMomentUtility.getTimestamp();
				this.$logger.debug('store', 'setRocketSetup', 'rorocketSetupsckets.c', this.rocketSetups, correlationId);
			},
			async setRockets(correlationId, value) {
				this.$logger.debug('store', 'setRockets', 'rockets.a', value, correlationId);
				this.$logger.debug('store', 'setRockets', 'rockets.b', this.rockets, correlationId);
				this.rockets = value;
				this.rocketsTtl = LibraryMomentUtility.getTimestamp();
				this.$logger.debug('store', 'setRockets', 'rockets.c', this.rockets, correlationId);
			},
			async setRocketSetups(correlationId, value) {
				this.$logger.debug('store', 'setRocketSetups', 'rocketSetups.a', value, correlationId);
				this.$logger.debug('store', 'setRocketSetups', 'rocketSetups.b', this.rocketSetups, correlationId);
				this.rocketSetups = value;
				this.rocketSetupsTtl = LibraryMomentUtility.getTimestamp();
				this.$logger.debug('store', 'setRocketSetups', 'rocketSetups.c', this.rocketSetups, correlationId);
			},
			async setRocketsExpanded(correlationId, value) {
				if (!value || String.isNullOrEmpty(value.id))
					return;
				this.rocketsExpanded[value.id] = value.expanded;
			},
			async setRocketsGallery(correlationId, value) {
				this.$logger.debug('store', 'setRocketsGallery', 'rockets.a', value, correlationId);
				this.$logger.debug('store', 'setRocketsGallery', 'rocketsGallery.b', this.rocketsGallery, correlationId);
				this.rocketsGallery = value;
				this.rocketsGalleryTtl = LibraryMomentUtility.getTimestamp();
				this.$logger.debug('store', 'setRocketsGallery', 'rocketsGallery.c', this.rocketsGallery, correlationId);
			},
			async setRocketGallery(correlationId, value) {
				this.$logger.debug('store', 'setRocketGallery', 'rocket.a', value, correlationId);
				this.$logger.debug('store', 'setRocketGallery', 'rocketsGallery.b', this.rocketsGallery, correlationId);
				this.rocketsGallery = LibraryCommonUtility.updateArrayByObject(this.rocketsGallery, value);
				this.rocketsGalleryTtl = LibraryMomentUtility.getTimestamp();
				this.$logger.debug('store', 'setRocketGallery', 'rocketsGallery.c', this.rocketsGallery, correlationId);
			},
			async setRocketsSearchCriteria(correlationId, value) {
				this.rocketsSearchCriteria = value;
			},
			async setRocketSetupsExpanded(correlationId, value) {
				if (!value || String.isNullOrEmpty(value.id))
					return;
				this.rocketSetupsExpanded[value.id] = value.expanded;
			},
			async setRocketSetupsSearchCriteria(correlationId, value) {
				this.rocketSetupsSearchCriteria = value;
			},
			async startChecklistById(correlationId, id) {
				const service = LibraryClientUtility.$injector.getService(AppSharedConstants.InjectorKeys.SERVICE_CHECKLISTS);
				const response = await service.start(correlationId, id);
				this.$logger.debug('store', 'startChecklistById', 'response', response, correlationId);
				if (Response.hasSucceeded(response))
					await this.setChecklist(correlationId, response.results);
				return response;
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
			async deleteLaunchById(correlationId, id) {
				return await LibraryClientUtility.$store.deleteLaunchById(correlationId, id);
			},
			async deleteLocationById(correlationId, id) {
				return await LibraryClientUtility.$store.deleteLocationById(correlationId, id);
			},
			async deletePartById(correlationId, id) {
				return await LibraryClientUtility.$store.deletePartById(correlationId, id);
			},
			async deleteRocketById(correlationId, id) {
				return await LibraryClientUtility.$store.deleteRocketById(correlationId, id);
			},
			async deleteRocketSetupById(correlationId, id) {
				return await LibraryClientUtility.$store.deleteRocketSetupById(correlationId, id);
			},
			async requestChecklistById(correlationId, id, editable) {
				return await LibraryClientUtility.$store.requestChecklistById(correlationId, id, editable);
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
			async requestCountries(correlationId) {
				return await LibraryClientUtility.$store.requestCountries(correlationId);
			},
			async requestInventory(correlationId, params) {
				return await LibraryClientUtility.$store.requestInventory(correlationId, params);
			},
			async requestLaunchById(correlationId, id, editable) {
				return await LibraryClientUtility.$store.requestLaunchById(correlationId, id, editable);
			},
			async requestLaunches(correlationId, params) {
				return await LibraryClientUtility.$store.requestLaunches(correlationId, params);
			},
			async requestLocationById(correlationId, id, editable) {
				return await LibraryClientUtility.$store.requestLocationById(correlationId, id, editable);
			},
			async requestLocations(correlationId, params) {
				return await LibraryClientUtility.$store.requestLocations(correlationId, params);
			},
			async requestManufacturers(correlationId) {
				return await LibraryClientUtility.$store.requestManufacturers(correlationId);
			},
			async requestMotor(correlationId, motorId) {
				return await LibraryClientUtility.$store.requestMotor(correlationId, motorId);
			},
			async requestMotorSearch(correlationId, criteria) {
				return await LibraryClientUtility.$store.requestMotorSearch(correlationId, criteria);
			},
			async requestMotorSearchReset(correlationId) {
				return await LibraryClientUtility.$store.requestMotorSearchReset(correlationId);
			},
			async requestPartById(correlationId, id, editable) {
				return await LibraryClientUtility.$store.requestPartById(correlationId, id, editable);
			},
			async requestParts(correlationId, params) {
				return await LibraryClientUtility.$store.requestParts(correlationId, params);
			},
			async requestPartsRocketSearch(correlationId, params) {
				return await LibraryClientUtility.$store.requestPartsRocketSearch(correlationId, params);
			},
			async requestRocketById(correlationId, id, editable) {
				return await LibraryClientUtility.$store.requestRocketById(correlationId, id, editable);
			},
			async requestRocketByIdGallery(correlationId, id) {
				return await LibraryClientUtility.$store.requestRocketByIdGallery(correlationId, id);
			},
			async requestRocketSetupById(correlationId, id, editable) {
				return await LibraryClientUtility.$store.requestRocketSetupById(correlationId, id, editable);
			},
			async requestRockets(correlationId, params) {
				return await LibraryClientUtility.$store.requestRockets(correlationId, params);
			},
			async requestRocketsGallery(correlationId, params) {
				return await LibraryClientUtility.$store.requestRocketsGallery(correlationId, params);
			},
			async requestRocketSetups(correlationId, params) {
				return await LibraryClientUtility.$store.requestRocketSetups(correlationId, params);
			},
			async saveChecklist(correlationId, checklist) {
				return await LibraryClientUtility.$store.saveChecklist(correlationId, checklist);
			},
			async saveInventory(correlationId, inventory) {
				return await LibraryClientUtility.$store.saveInventory(correlationId, inventory);
			},
			async saveLaunch(correlationId, launch) {
				return await LibraryClientUtility.$store.saveLaunch(correlationId, launch);
			},
			async saveLocation(correlationId, location) {
				return await LibraryClientUtility.$store.saveLocation(correlationId, location);
			},
			async savePart(correlationId, part) {
				return await LibraryClientUtility.$store.savePart(correlationId, part);
			},
			async saveRocket(correlationId, rocket) {
				return await LibraryClientUtility.$store.saveRocket(correlationId, rocket);
			},
			async saveRocketStage(correlationId, rocket, stage) {
				return await LibraryClientUtility.$store.saveRocketStage(correlationId, rocket, stage);
			},
			async saveRocketVideo(correlationId, rocket, stage) {
				return await LibraryClientUtility.$store.saveRocketVideo(correlationId, rocket, stage);
			},
			async saveRocketStageDelete(correlationId, rocket, id) {
				return await LibraryClientUtility.$store.saveRocketStageDelete(correlationId, rocket, id);
			},
			async saveRocketStagePart(correlationId, rocket, stage) {
				return await LibraryClientUtility.$store.saveRocketStagePart(correlationId, rocket, stage);
			},
			async saveRocketSetup(correlationId, rocket) {
				return await LibraryClientUtility.$store.saveRocketSetup(correlationId, rocket);
			},
			async saveRocketSetupStage(correlationId, rocket, stage) {
				return await LibraryClientUtility.$store.saveRocketSetupStage(correlationId, rocket, stage);
			},
			async saveRocketSetupStageDelete(correlationId, rocket, id) {
				return await LibraryClientUtility.$store.saveRocketSetupStageDelete(correlationId, rocket, id);
			},
			async saveRocketSetupStagePart(correlationId, rocket, stage) {
				return await LibraryClientUtility.$store.saveRocketSetupStagePart(correlationId, rocket, stage);
			},
			async saveRocketVideoDelete(correlationId, rocket, id) {
				return await LibraryClientUtility.$store.saveRocketVideoDelete(correlationId, rocket, id);
			},
			async setChecklistsSearchCriteria(correlationId, value) {
				await LibraryClientUtility.$store.setChecklistsSearchCriteria(correlationId, value);
			},
			async setInventoryExpanded(correlationId, value) {
				await LibraryClientUtility.$store.setInventoryExpanded(correlationId, value);
			},
			async setInventorySettings(correlationId, value) {
				await LibraryClientUtility.$store.setInventorySettings(correlationId, value);
			},
			async setLocationsExpanded(correlationId, value) {
				await LibraryClientUtility.$store.setLocationsExpanded(correlationId, value);
			},
			async setLaunchesSettings(correlationId, value) {
				await LibraryClientUtility.$store.setLaunchesSettings(correlationId, value);
			},
			async setLocationsSearchCriteria(correlationId, value) {
				await LibraryClientUtility.$store.setLocationsSearchCriteria(correlationId, value);
			},
			async setMotorSearchCriteria(correlationId, value) {
				await LibraryClientUtility.$store.setMotorSearchCriteria(correlationId, value);
			},
			async setPartsRocketSearchCriteria(correlationId, value) {
				await LibraryClientUtility.$store.setPartsRocketSearchCriteria(correlationId, value);
			},
			async setPartsSearchCriteria(correlationId, value) {
				await LibraryClientUtility.$store.setPartsSearchCriteria(correlationId, value);
			},
			async setRocketsExpanded(correlationId, value) {
				await LibraryClientUtility.$store.setRocketsExpanded(correlationId, value);
			},
			async setRocketsSearchCriteria(correlationId, value) {
				await LibraryClientUtility.$store.setRocketsSearchCriteria(correlationId, value);
			},
			async setRocketSetupsExpanded(correlationId, value) {
				await LibraryClientUtility.$store.setRocketSetupsExpanded(correlationId, value);
			},
			async setRocketSetupsSearchCriteria(correlationId, value) {
				await LibraryClientUtility.$store.setRocketSetupsSearchCriteria(correlationId, value);
			},
			async setOnline(correlationId, value) {
				await LibraryClientUtility.$store.setOnline(correlationId, value);
			},
			async startChecklistById(correlationId, id) {
				return await LibraryClientUtility.$store.startChecklistById(correlationId, id);
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
			getChecklistsSearchCriteria() {
				return LibraryClientUtility.$store.checklistsSearchCriteria;
			},
			getContent() {
				return LibraryClientUtility.$store.content;
			},
			getContentInfo() {
				const temp = LibraryClientUtility.$store.content;
				if (!temp)
					return [];
				if (!temp.info)
					return [];
				let temp2 = temp.info.filter(l => l.id !== 'slideshow');
				temp2 = temp2.filter(l => l.enabled);
				if (LibraryClientUtility.$store.mobileOnly)
					return temp2.filter(l => l.mobile);
				return temp2;
			},
			getContentInfoSlideshow() {
				const temp = LibraryClientUtility.$store.content;
				if (!temp)
					return '';
				if (!temp.info)
					return '';
				let temp2 = temp.info.find(l => l.id === 'slideshow');
				if (!temp2)
					return '';
				if (!temp2.enabled)
					return '';
				return temp2.link;
			},
			getContentTools() {
				const temp = LibraryClientUtility.$store.content;
				if (!temp)
					return [];
				if (!temp.tools)
					return [];
				const temp2 = temp.tools.filter(l => l.enabled);
				if (LibraryClientUtility.$store.mobileOnly)
					return temp2.filter(l => l.mobile);
				return temp2;
			},
			getInventoryExpanded() {
				return LibraryClientUtility.$store.inventoryExpanded;
			},
			getInventorySettings() {
				return LibraryClientUtility.$store.inventorySettings;
			},
			getLaunchesSettings() {
				return LibraryClientUtility.$store.launchesSettings;
			},
			getLocationsSearchCriteria() {
				return LibraryClientUtility.$store.LocationsSearchCriteria;
			},
			getLocationsExpanded() {
				return LibraryClientUtility.$store.locationsExpanded;
			},
			getMotorSearchCriteria() {
				return LibraryClientUtility.$store.motorSearchCriteria;
			},
			getOnline() {
				return LibraryClientUtility.$store.online;
			},
			getPartsRocketSearchCriteria() {
				return LibraryClientUtility.$store.partsRocketSearchCriteria;
			},
			getPartsSearchCriteria() {
				return LibraryClientUtility.$store.partsSearchCriteria;
			},
			getRockets() {
				return LibraryClientUtility.$store.rockets;
			},
			getRocketsExpanded() {
				return LibraryClientUtility.$store.rocketsExpanded;
			},
			getRocketsSearchCriteria() {
				return LibraryClientUtility.$store.rocketsSearchCriteria;
			},
			getRocketSetupsSearchCriteria() {
				return LibraryClientUtility.$store.rocketSetupsSearchCriteria;
			},
			getRocketSetupsExpanded() {
				return LibraryClientUtility.$store.rocketSetupsExpanded;
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
			checklistsDragItem: null,
			checklistsSearchCriteria: {},
			checkliststTtl: 0,
			checklistsTtlDiff: 1000 * 60 * 30,
			checksumLastUpdate: [],
			content: [],
			contentTtl: 0,
			contentTtlDiff: 1000 * 60 * 30,
			contentMarkup: [],
			contentMarkupTtl: 0,
			contentMarkupTtlDiff: 1000 * 60 * 30,
			countries: [],
			countriesTtl: 0,
			countriesTtlDiff: 1000 * 60 * 30,
			inventory: [],
			inventoryExpanded: [],
			inventorySettings: {},
			inventoryTtl: 0,
			inventoryTtlDiff: 1000 * 60 * 30,
			launches: [],
			launchesSettings: {},
			launchesTtl: 0,
			launchesTtlDiff: 1000 * 60 * 30,
			locations: [],
			locationsExpanded: {},
			locationsSearchCriteria: {},
			locationsTtl: 0,
			locationsTtlDiff: 1000 * 60 * 30,
			manufacturers: [],
			manufacturersTtl: 0,
			manufacturersTtlDiff: 1000 * 60 * 30,
			mobileOnly: false,
			motorSearchCriteria: {},
			motorSearchResults: {},
			online: {},
			parts: [],
			partsRocketSearchResults: [],
			partsRocketSearchCriteria: {},
			partsSearchCriteria: {},
			rockets: [],
			rocketsExpanded: {},	
			rocketsGallery: [],
			rocketsGalleryTtl: 0,
			rocketsGalleryTtlDiff: 1000 * 60 * 30,
			rocketsSearchCriteria: {},
			rocketSetups: [],
			rocketSetupsExpanded: {},
			rocketSetupsSearchCriteria: {},
			rocketSetupsTtl: 0,
			rocketSetupsTtlDiff: 1000 * 60 * 30,
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
