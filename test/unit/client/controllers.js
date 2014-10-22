describe('Unit: FormCtrl', function() {
    beforeEach(module('simpleform'));
    
    var ctrl, scope, httpBackend;
    beforeEach(inject(function($injector) {
        scope = $injector.get('$rootScope').$new();
        
        createController = function() {
             return $injector.get('$controller')('FormCtrl', {$scope: scope });
        }

        httpBackend = $injector.get('$httpBackend');

        // GET /form/1
        var form = [{label:"What's your biggest concern?",id:"main-concern",name:"mainConcern",type:"select",options:[{label:"Health",value:"health",nextFields:["health"]},{label:"Money",value:"money",nextFields:["money"]},{label:"Wife",value:"wife",nextFields:["nothing-to-do"]}]},{label:"Oh damn, what's wrong with you?",id:"health",name:"health",type:"select",options:[{label:"Back pain",value:"back-pain",nextFields:["sport-hours-per-week","health-backpain-submit"]},{label:"Sanity",value:"sanity",nextFields:["age","poem","health-sanity-submit"]}]},{label:"Poor man! What's the problem?",id:"money",name:"money",type:"select",options:[{label:"I've got too little",value:"too-little",nextFields:["money-toolittle-submit"]},{label:"I've got too much",value:"too-much",nextFields:["money-toomuch-submit"]}]},{label:"Sorry, nothing to do.",id:"nothing-to-do",name:"nothingToDo",value:"period",type:"hidden"},{label:"How many hours of sport you do per week?",id:"sport-hours-per-week",name:"sportHoursPerWeek",type:"radio",options:[{label:"less than 5",value:"less-than-5"},{label:"more than 5 or 5",value:"more-than-5"}]},{label:"What's your age?",id:"age",name:"age",type:"text"},{label:"Write a poem.",id:"poem",name:"poem",type:"textarea"},{label:"",id:"health-backpain-submit",name:"submit",type:"submit"},{label:"",id:"health-sanity-submit",name:"submit",type:"submit"},{label:"",id:"money-toomuch-submit",name:"submit",type:"submit"},{label:"",id:"money-toolittle-submit",name:"submit",type:"submit"}];
        httpBackend.when("GET", "/form/1").respond(form);
    }));

   afterEach(function() {
       httpBackend.verifyNoOutstandingExpectation();
       httpBackend.verifyNoOutstandingRequest();
   });
    
    it('should return error and leave fileUploading true', 
    function() {
        expect(scope.fileUploading).not.toBeDefined();
        var controller = createController();
        httpBackend.expect("POST", "/answer").respond(500);
        scope.submit();
        httpBackend.flush();
        expect(scope.fileUploading).toBe(true);
    });

    it('should return success and set fileUploading false',
    function() {
        var controller = createController();
        httpBackend.expect("POST", "/answer").respond(200);
        scope.submit();
        httpBackend.flush();
        expect(scope.fileUploading).toBe(false);
    });

    it('should handle form fields\' shows and values',
    function() {
        var controller = createController();
        httpBackend.flush(); // GET /form/1

        var poemFieldIdx, healthFieldIdx, moneyFieldIdx, mainConcernFieldIdx;
        for (var i = 0; i < scope.form.length; i++) {
            if (scope.form[i].id == 'main-concern') {
                mainConcernFieldIdx = i;
            } else if (scope.form[i].id == 'health') {
                healthFieldIdx = i;
            } else if (scope.form[i].id == 'money') {
                moneyFieldIdx = i;
            } else if (scope.form[i].id == 'poem') {
                poemFieldIdx = i;
            } else if (scope.form[i].id == 'sanity') {
                sanityFieldIdx = i;
            }
        }

        scope.form[healthFieldIdx].value = 'sanity'; // sanity option selected
        scope.showNextFields(scope.form[healthFieldIdx]);
        scope.form[poemFieldIdx].value = 'This is a poem';

        scope.description = 'This is a description.';
        scope.name = 'Lassi';

        scope.submit();

        expect(scope.form[mainConcernFieldIdx].show).toBe(true);
        expect(scope.form[healthFieldIdx].show).toBe(true);
        expect(scope.form[moneyFieldIdx].show).toBe(false);
        expect(scope.form[poemFieldIdx].show).toBe(true);

        httpBackend.expect("POST", "/answer").respond(200);
        httpBackend.flush(); // POST /answer

        expect(scope.fields[0].description).toBe('This is a description.');
        expect(scope.fields[1].name).toBe('Lassi');
        expect(scope.fields[2].health).toBe('sanity');
        expect(scope.fields[3].poem).toBe('This is a poem');
    });

});


