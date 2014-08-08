'use strict';

describe('Controller: ReportTweetCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ReportCtrl,
      scope,
      $httpBackend,
      Report = {
        getSelectedCoverage: function(){},
        checkPublished: function(){}
      },
      Coverages = { promise: { then: function(){} } },
      dependencies = {
        $routeParams: {id: 'abcdef'},
        Report: Report,
        Coverages: Coverages
      },
      api;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _api_) {
    api = _api_;
    scope = $rootScope.$new();
    dependencies.$scope = scope;
    spyOn(api.reports, 'getById').andCallThrough();
    spyOn(api.steps, 'query').andCallThrough();
    ReportCtrl = $controller('ReportTweetCtrl', dependencies);
    $httpBackend = _$httpBackend_;
    api.reports.def.getById
      .resolve(angular.copy(mocks.reports['538df48f9c616729ad000035']));
    api.steps.def.query.resolve(mocks.steps.list);
    scope.$digest();
  }));

  it('has the correct link to the endpoint', function() {
    expect(scope.report._links.self.href).toBe('http://cd2.sourcefabric.net/citizendesk-interface/reports/53ba73019c6167462300068b');
  });
  it('attaches a report to the scope', function () {
    expect(scope.report).toBeDefined();
  });
  it('disables report verification', function() {
    scope.$apply();
    expect(scope.wait).toBe(true);
  });
  describe('after all steps are done', function() {
    beforeEach(function() {
      scope.report.steps.forEach(function(step) {
        step.done = true;
      });
      scope.$apply();
    });
    it('enables report verification', function() {
      expect(scope.wait).toBe(false);
    });
  });
  describe('starting with existent steps', function() {
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      dependencies.$scope = scope;
      api.reports.reset.getById();
      api.steps.reset.query();
      ReportCtrl = $controller('ReportTweetCtrl', dependencies);
      api.reports.def.getById
        .resolve(angular.copy(mocks.reports['538df48f9c616729ad000035']));
      api.steps.def.query.resolve(mocks.steps.list);
      scope.$digest();
    }));
    it('disables report verification', function() {
      scope.$apply();
      expect(scope.wait).toBe(true);
    });
    describe('after all steps are done', function() {
      beforeEach(function() {
        scope.report.steps.forEach(function(step) {
          step.done = true;
        });
        scope.$apply();
      });
      it('enables report verification', function() {
        expect(scope.wait).toBe(false);
      });
    });
  });
  describe('when starting a transcript', function() {
    beforeEach(function() {
      scope.startTranscript();
    });
    it('enables the buttons', function() {
      expect(scope.disableTranscript).toBeFalsy();
    });
    it('has a transcript candidate', function() {
      expect(scope.transcriptCandidate).toBeTruthy();
    });
    it('is editing a transcript', function() {
      expect(scope.editingTranscript).toBe(true);
    });
    it('copies the original content', function() {
      expect(scope.transcriptCandidate).toBe('#Mozambique Council of State is discussing the military conflict that has killed dozens &amp; forced many to flee central district of #Muxungue');
    });
    describe('when discarding', function() {
      beforeEach(function() {
        scope.cancelTranscriptEditing();
      });
      it('is not editing a transcript', function() {
        expect(scope.editingTranscript).toBe(false);
      });
    });
    describe('when saving', function() {
      beforeEach(function() {
        spyOn(api.reports, 'update').andCallThrough();
        scope.transcriptCandidate = 'edited';
        scope.saveTranscript();
      });
      it('asks to update', function(){
        expect(api.reports.update).toHaveBeenCalled();
      });
      it('disables the input', function() {
        expect(scope.disableTranscript).toBe(true);
      });
      describe('when saved', function() {
        beforeEach(function() {
          var response = angular.copy(scope.report);
          response.texts[0].transcript = 'edited';
          api.reports.def.update.resolve(response);
          scope.$digest();
        });
        it('updates the model', function() {
          expect(scope.report.texts[0].transcript).toBe('edited');
        });
        it('enables the buttons', function() {
          expect(scope.disableTranscript).toBe(false);
        });
        it('has a transcript', function() {
          expect(scope.hasTranscript).toBeTruthy();
        });
        it('is not editing a transcript', function() {
          expect(scope.editingTranscript).toBe(false);
        });
        afterEach(function() {
          $httpBackend.verifyNoOutstandingRequest();
          $httpBackend.verifyNoOutstandingExpectation();
        });
      });
    });
  });
});
