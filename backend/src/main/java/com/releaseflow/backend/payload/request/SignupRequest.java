package com.releaseflow.backend.payload.request;

import com.releaseflow.backend.model.Role;

public class SignupRequest {
    private String username;
    private String password;
    private Role role;

    public SignupRequest() {}

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
