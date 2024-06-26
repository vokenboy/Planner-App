package com.PlannerApp.PlannerApp.Controller;

import com.PlannerApp.PlannerApp.Models.Group;
import com.PlannerApp.PlannerApp.Models.User;
import com.PlannerApp.PlannerApp.Services.GroupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/group")
@RequiredArgsConstructor
@Slf4j
public class GroupController {

    private final GroupService groupService;

    @PostMapping("/insert")
    @ResponseStatus(HttpStatus.CREATED)
    public UUID insertGroup(@RequestBody Group group){
        return groupService.insertGroup(group);
    }

    @GetMapping("/get/name/{groupId}")
    public Optional<Group> getGroupName(@PathVariable UUID groupId) {
        return groupService.getGroupName(groupId);
    }

    @PutMapping("/removeUser/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public void removeUserFromGroup(@PathVariable UUID userId) {
        groupService.removeUserFromGroup(userId);
    }

    @DeleteMapping("/delete/{groupId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteGroup(@PathVariable UUID groupId) {
        groupService.deleteGroup(groupId);
    }

    @PutMapping("/changeOwner/{groupId}/{newOwnerId}")
    @ResponseStatus(HttpStatus.OK)
    public void changeOwner(@PathVariable UUID groupId, @PathVariable UUID newOwnerId) {
        groupService.changeOwner(groupId, newOwnerId);
    }


}
