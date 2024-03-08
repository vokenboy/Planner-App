package com.PlannerApp.PlannerApp.Repositories;

import com.PlannerApp.PlannerApp.Entities.UserEntity;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;


@Repository
@Mapper
public interface UserRepository {

    @Insert("INSERT INTO users (id, username) " +
            "VALUES (#{user.id}, #{user.username})")
    void insertUser(@Param("user") UserEntity user);

    @Select("SELECT id, username FROM users WHERE username = #{username}")
    Optional<UserEntity> findByUsername(@Param("username") String username);

}
