kubectl get nodes \
    -o custom-columns='NAME:.metadata.name,STATUS:.status.conditions[?(@.type=="Ready")].type,CREATION:.metadata.creationTimestamp,INTERNAL-IP:.status.addresses[?(@.type=="InternalIP")].address,EXTERNAL-IP:.status.addresses[?(@.type=="ExternalIP")].address,TIER:.metadata.labels.tier'
