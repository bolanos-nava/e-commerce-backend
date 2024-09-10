import dns from 'dns';

const mongoSvcName = process.env.KUBE_MONGO_SVC_NAME || 'mongodb-svc';
const namespace = process.env.KUBE_NAMESPACE || 'default';

const dnsString = `${mongoSvcName}.${namespace}.svc.cluster.local`;

export default function discoverReplicaSet() {
  return new Promise((resolve, reject) => {
    dns.resolveSrv(dnsString, (err, addresses) => {
      if (err) reject(err);
      if (!Array.isArray(addresses)) reject();

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
