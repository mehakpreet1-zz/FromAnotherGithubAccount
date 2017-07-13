'use strict';

module.exports = {
	marketPlaceName: 'AppDirect',
	theme: 'appdirectapp',
	locale: 'en',
	memberships: [
		{
			company: {
				uuid: 1,
				name: 'Company One'
			}
		},
		{
			company: {
				uuid: 22,
				name: 'Company Twenty Two'
			}
		}
	],
	UserInfo: {
		user_id: 'testUserID',
		email: 'test.email@appdirect.com',
		userName: 'testUsername',
		name: 'Test Name',
		company_id: 1,
		roles: [
			'SUPERUSER',
			'USER',
			'SUPER_SUPPORT'
		]
	},
	CHANNEL_SETTINGS: {
		partner: 'APPDIRECT',
		companyName: 'AppDirect',
		currency: 'USD',
		localeTags: ['en', 'en-US', 'fr-CA', 'fr-FR']
	},
	CompanyInfo: null,
	CurrentUser: null,
	IMG_BASE: 'http://localhost:8080'
};
