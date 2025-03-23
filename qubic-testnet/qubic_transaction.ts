import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper.js';
import { QubicConnector } from '@qubic-lib/qubic-ts-library/dist/QubicConnector.js';
import { QubicTransaction } from '@qubic-lib/qubic-ts-library/dist/qubic-types/QubicTransaction.js';
import { PublicKey } from '@qubic-lib/qubic-ts-library/dist/qubic-types/PublicKey.js';
import { Long } from '@qubic-lib/qubic-ts-library/dist/qubic-types/Long';

function generarSeed(longitud: number = 58): string {
  const letras = 'abcdefghijklmnopqrstuvwxyz';
  return Array.from({ length: longitud }, () => letras.charAt(Math.floor(Math.random() * letras.length))).join('');
}

async function main() {
  const helper = new QubicHelper();
  const seedEmisor = generarSeed();
  const idEmisor = await helper.createIdPackage(seedEmisor);

  const seedReceptor = generarSeed();
  const idReceptor = await helper.createIdPackage(seedReceptor);

  console.log('Seed Emisor:', seedEmisor);
  console.log('ID Emisor:', idEmisor.publicId);
  console.log('Seed Receptor:', seedReceptor);
  console.log('ID Receptor:', idReceptor.publicId);

  const rpcUrl = 'https://testnet-rpc.qubic.org';

  const statusRes = await fetch(`${rpcUrl}/v1/status`);
  const status = await statusRes.json();

  const currentTick = status.lastProcessedTick.tickNumber;
  const targetTick = currentTick + 10;
  console.log(`📡 Tick actual: ${currentTick} | Tick objetivo: ${targetTick}`);


  const tx = new QubicTransaction()
    .setSourcePublicKey(new PublicKey(idEmisor.publicId))
    .setDestinationPublicKey(new PublicKey(idReceptor.publicId))
    .setAmount(new Long(100))
    .setTick(targetTick)
    .setInputType(0)
    .setInputSize(0);

  await tx.build(seedEmisor);

  const encodedTx = tx.encodeTransactionToBase64(tx.getPackageData());

  const res = await fetch(`${rpcUrl}/v1/broadcast-transaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ encodedTransaction: encodedTx }),
  });

  const resData = await res.json();
  if (res.ok) {
    console.log('✅ Transacción enviada con éxito');
    console.log('Transaction ID:', resData.transactionId);
    console.log('Tick programado:', targetTick);
  } else {
    console.error('❌ Error al enviar transacción:', resData);
  }
}

main().catch(console.error);
