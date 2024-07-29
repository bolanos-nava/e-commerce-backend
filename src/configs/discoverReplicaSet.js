import dns from 'dns';

const headlessServiceName = 'mongodb-service';
const namespace = 'default';

const dnsString = `${headlessServiceName}.${namespace}.svc.cluster.local`;

export default function discoverReplicaSet() {
  return new Promise((resolve, reject) => {
    dns.resolveSrv(dnsString, (err, addresses) => {
      if (err) reject(err);

      const replicaSetAddress = addresses
        .map(({ name, port }) => {
          const host = name.split(`.${namespace}`)[0];
          return `${host}:${port}`;
        })
        .join(',');

      resolve(replicaSetAddress);
    });
  });
}
