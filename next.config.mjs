// import {withSentryConfig} from "@sentry/nextjs";
/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			"encrypted-tbn0.gstatic.com",
			"firebasestorage.googleapis.com",
			"fps.cdnpk.net",
			"via.placeholder.com",
			"images.freeimages.com",
		],
	}, //for development purpose adding this domain
	eslint: {
		ignoreDuringBuilds: true,
	},
	output: "standalone",
};

export default nextConfig;
