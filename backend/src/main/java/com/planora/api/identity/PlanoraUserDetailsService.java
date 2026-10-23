package com.planora.api.identity;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class PlanoraUserDetailsService implements UserDetailsService {

    private final UserAccountRepository users;

    public PlanoraUserDetailsService(UserAccountRepository users) {
        this.users = users;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return users.findByEmailIgnoreCase(username)
                .map(PlanoraUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("Unknown user"));
    }
}
