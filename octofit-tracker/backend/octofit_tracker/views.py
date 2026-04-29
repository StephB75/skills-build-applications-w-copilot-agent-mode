from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from .models import Activity, Leaderboard, User, Workout, Team
from .serializers import (
    ActivitySerializer,
    LeaderboardSerializer,
    UserSerializer,
    WorkoutSerializer,
    TeamSerializer,
)


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all().order_by('name')
    serializer_class = TeamSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('name')
    serializer_class = UserSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all().order_by('-date')
    serializer_class = ActivitySerializer


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all().order_by('name')
    serializer_class = WorkoutSerializer


class LeaderboardViewSet(viewsets.ModelViewSet):
    queryset = Leaderboard.objects.all().order_by('-score')
    serializer_class = LeaderboardSerializer


@api_view(['GET'])
def api_root(request, format=None):
    return Response(
        {
            'teams': reverse('team-list', request=request, format=format),
            'users': reverse('user-list', request=request, format=format),
            'activities': reverse('activity-list', request=request, format=format),
            'workouts': reverse('workout-list', request=request, format=format),
            'leaderboard': reverse('leaderboard-list', request=request, format=format),
        }
    )
