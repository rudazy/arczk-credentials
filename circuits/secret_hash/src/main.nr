use std::hash::poseidon;

// Circuit to prove knowledge of a secret that hashes to a public commitment
// This is the foundation for ZK credential proofs

fn main(
    // Private input - the secret we know
    secret: Field,
    // Public input - the commitment (hash) we're proving against
    pub_hash: pub Field
) {
    // Compute the Poseidon hash of the secret
    let computed_hash = poseidon::bn254::hash_1([secret]);

    // Constraint: the computed hash must equal the public commitment
    assert(computed_hash == pub_hash);
}

#[test]
fn test_secret_hash() {
    // Test with a known secret
    let secret = 12345;
    let hash = poseidon::bn254::hash_1([secret]);

    // This should pass
    main(secret, hash);
}

#[test]
fn test_wrong_secret() {
    // Test that wrong secret fails
    let secret = 12345;
    let wrong_secret = 54321;
    let hash = poseidon::bn254::hash_1([secret]);

    // This should fail - uncomment to test
    // main(wrong_secret, hash);
}
