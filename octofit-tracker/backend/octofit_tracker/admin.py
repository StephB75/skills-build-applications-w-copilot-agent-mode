from django.contrib import admin

from .models import Activity, Leaderboard, User, Workout, Team


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'email', 'team']
    list_filter = ['team']
    search_fields = ['name', 'email']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'type', 'duration', 'date']
    list_filter = ['type', 'date']
    search_fields = ['user__name', 'type']


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'suggested_for']
    search_fields = ['name', 'suggested_for']


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'score']
    ordering = ['-score']
    search_fields = ['user__name']
