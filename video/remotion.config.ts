/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95); // Remotion default is 80; 92-95 is promo grade.
Config.setCrf(16); // H.264 quality target. Lower = sharper + larger. Default ~18.
Config.setPixelFormat("yuv420p"); // Safest for mpv / VLC / Teams.
Config.setAudioCodec("aac");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig(enableTailwind);
