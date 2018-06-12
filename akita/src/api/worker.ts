import { Observable } from 'rxjs';

function serialize(object) {
  return JSON.stringify(object, function(key, value) {
    if (typeof value === 'function') {
      return value.toString();
    }
    return value;
  });
}

function createWorker() {
  const blob = new Blob(
    [
      `self.onmessage = function(e) {

      function deserialize(str) {
        return JSON.parse(str || '', function(key, value) {
          if (value &&
            typeof value === "string" &&
            value.substr(0, 8) == "function") {
            var startBody = value.indexOf('{') + 1;
            var endBody = value.lastIndexOf('}');
            var startArgs = value.indexOf('(') + 1;
            var endArgs = value.indexOf(')');
            return new Function(value.substring(startArgs, endArgs), value.substring(startBody, endBody));
          }
          return value;
        });
      }

      var deserialized = deserialize(e.data);
      var mapped = deserialized.data.map(function(d) {
        return deserialized.factory(d);
      });

      self.postMessage(mapped);
    }`
    ],
    {
      type: 'text/javascript'
    }
  );

  const url = URL.createObjectURL(blob);
  return new Worker(url);
}

/**
 *   const mockTodos = Array.from({length: 10000}, (_, x) => ({id: x}));
 *
 *   of(mockTodos).pipe(mapInWorker<Todo>(createTodo))
 *   .subscribe(res => console.log(res));
 */
export function mapInWorker<T>(factoryFn: Function) {
  return function(source): Observable<T[]> {
    return new Observable(observer => {
      const worker = createWorker();

      worker.onmessage = function(e) {
        observer.next(e.data);
        observer.complete();
        worker.terminate();
      };

      worker.onerror = function(err) {
        observer.error(err);
        observer.complete();
        worker.terminate();
      };

      return source.subscribe(value => {
        const input = {
          factory: factoryFn,
          data: value
        };
        const serialized = serialize(input);

        worker.postMessage(serialized);
      });
    });
  };
}
