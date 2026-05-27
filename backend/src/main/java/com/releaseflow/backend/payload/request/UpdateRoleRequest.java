package com.releaseflow.backend.payload.request;

import com.releaseflow.backend.model.Role;

public class UpdateRoleRequest {
    private Role role;

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
