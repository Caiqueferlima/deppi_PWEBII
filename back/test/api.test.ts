import assert from 'node:assert/strict';
import { once } from 'node:events';
import http from 'node:http';
import { after, before, describe, it } from 'node:test';

process.env.DATABASE_HOST ??= 'localhost';
process.env.DATABASE_PORT ??= '3306';
process.env.DATABASE_USER ??= 'pweb';
process.env.DATABASE_PASSWORD ??= 'pweb1-projeto-ifce';
process.env.DATABASE_NAME ??= 'api-ger-extensao';
process.env.JWT_SECRET ??= 'test-secret';

const { default: app } = await import('../src/app.js');

let server: http.Server;
let baseUrl: string;

before(async () => {
  server = app.listen(0);
  await once(server, 'listening');

  const address = server.address();
  assert(address && typeof address !== 'string');
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  server.close();
  await once(server, 'close');
});

describe('API básica', () => {
  it('responde ao healthcheck', async () => {
    const response = await fetch(`${baseUrl}/health`);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok' });
  });

  it('retorna 404 para uma rota inexistente', async () => {
    const response = await fetch(`${baseUrl}/rota-inexistente`);

    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), {
      error: 'Rota nao encontrada.',
    });
  });

  it('bloqueia /autenticacao/me sem token', async () => {
    const response = await fetch(`${baseUrl}/autenticacao/me`);

    assert.equal(response.status, 401);
  });

  it('valida o corpo do login antes de acessar o banco', async () => {
    const response = await fetch(`${baseUrl}/autenticacao/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    assert.equal(response.status, 400);
    const body = await response.json();
    assert(body.error);
  });
});
