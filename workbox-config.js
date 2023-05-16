module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{png,js,html,nix,css}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};