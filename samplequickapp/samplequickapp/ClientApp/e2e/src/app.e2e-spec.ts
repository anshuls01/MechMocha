// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { AppPage } from './app.po';

describe('samplequickapp App', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display application title: samplequickapp', () => {
        page.navigateTo();
        expect(page.getAppTitle()).toEqual('samplequickapp');
    });
});
