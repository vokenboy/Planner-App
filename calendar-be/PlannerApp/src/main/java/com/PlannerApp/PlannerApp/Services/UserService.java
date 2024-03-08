package com.PlannerApp.PlannerApp.Services;

import com.PlannerApp.PlannerApp.Entities.UserEntity;
import com.PlannerApp.PlannerApp.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    @Autowired
    private final UserRepository userRepository;

    public void insertUser(String username) {
        UUID userID = UUID.randomUUID();
        UserEntity userEntity = UserEntity.builder()
                .id(userID)
                .username(username)
                .build();

        userRepository.insertUser(userEntity);
    }

    public UUID getUserIDByUsername(String username) {
        Optional<UserEntity> user = userRepository.findByUsername(username);
        return user.map(UserEntity::getId).orElse(null);
    }
}
