import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  http.get(`http://localhost:3000/reviews/meta?product_id=${~~(Math.random() * 1900000)}`);
  sleep(1);
}
