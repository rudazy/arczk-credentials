use std::hash::pedersen_hash;

// Circuit to prove knowledge of a secret that hashes to a public commitment
// This is the foundation for ZK credential proofs
// Using Pedersen hash for stability across Noir versions

fn main(
    // Private input - the secret we know
    secret: Field,
    // Public input - the commitment (hash) we're proving against
    pub_hash: pub Field
) {
    // Compute the Pedersen hash of the secret
    let computed_hash = pedersen_hash([secret]);

    // Constraint: the computed hash must equal the public commitment
    assert(computed_hash == pub_hash);
}

#[test]
fn test_secret_hash() {
    // Test with a known secret
    let secret: Field = 12345;
    let hash = pedersen_hash([secret]);

    // This should pass
    main(secret, hash);
}
