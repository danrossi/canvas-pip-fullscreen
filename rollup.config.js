import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import includePaths from 'rollup-plugin-includepaths';

const banner = `
/**
 * @license
 * canvas-pip-fullscreen
 * @author danrossi / https://github.com/danrossi
 * Copyright (c) 2017 Google
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
`;
export default [
	{
		input: './index.js',
		plugins: [
			resolve(),
			includePaths({
				include: {
				  //'ios-detection-utils': './node_modules/screenlock-api/build/iosutils.module.js'
				}
		  	}),
			terser()
		],
		output: [
			{
				format: 'iife',
				name: "pip",
				banner: banner,
				file: 'build/canvas-pip-fullscreen.min.js'
			}
		]
	},
	{
		input: './index.js',
		plugins: [
			resolve(),
			includePaths({
				include: {
				  //'iosutils': './node_modules/screenlock-api/build/iosutils.module.js'
				}
		  	})
		],
		output: [
			{
				format: 'esm',
				banner: banner,
				file: 'build/canvas-pip-fullscreen.module.js'
			}
		]
	}
];