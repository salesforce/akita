import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { <%= classify(name) %>Service } from './<%= dasherize(name) %>.service';
import { <%= classify(name) %>Store } from './<%= dasherize(name) %>.store';

describe('<%= classify(name) %>Service', () => {
  let <%= camelize(name) %>Service: <%= classify(name) %>Service;
  let <%= camelize(name) %>Store: <%= classify(name) %>Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [<%= classify(name) %>Service, <%= classify(name) %>Store],
      imports: [ HttpClientTestingModule ]
    });

    <%= camelize(name) %>Service = TestBed.get(<%= classify(name) %>Service);
    <%= camelize(name) %>Store = TestBed.get(<%= classify(name) %>Store);
  });

  it('should be created', () => {
    expect(<%= camelize(name) %>Service).toBeDefined();
  });

});
