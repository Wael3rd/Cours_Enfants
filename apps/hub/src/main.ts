import '@ce/core/styles/base.css';
import '../../../assets/fonts/fonts.css';
import { mount } from 'svelte';
import { registerSW } from 'virtual:pwa-register';
import { installAudioUnlock, setupUpdater } from '@ce/core';
import App from './App.svelte';

installAudioUnlock();
const updater = setupUpdater(registerSW);

mount(App, { target: document.getElementById('app')!, props: { updater } });
