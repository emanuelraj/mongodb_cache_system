# mongodb_cache_system

1. Get All Cache - Endpoint - /api/v1/cache/

2. Get Cache by key - Endpoint - /api/v1/cache/', query string: { key: 'random_key' }

3. POST Cache - { method: 'POST',
  url: '/api/v1/cache/',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  form: { key: 'Allen Emanuel', value: 'testingssdd' } }


4. PUT Cache -  { method: 'PUT',
  url: '/api/v1/cache/',
  headers: { 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  formData: { key: 'Allen', value: 'Reverse Testing' } }
  
5. DELETE All Cache - { method: 'DELETE',
  url: 'http://localhost:8080/api/v1/cache/',
  headers: { 'content-type': 'application/x-www-form-urlencoded' } }
  
6. DELETE Cache by Key - { method: 'DELETE',
  url: 'http://localhost:8080/api/v1/cache/',
  qs: { key: 'Allensssssssss' },
  headers: { 'content-type': 'application/x-www-form-urlencoded' } }
  
