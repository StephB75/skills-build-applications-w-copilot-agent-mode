from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Activity, Leaderboard, User, Workout, Team


class OctofitApiTests(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Team Alpha')
        self.user = User.objects.create(name='Jane Doe', email='jane@example.com', team=self.team)
        self.workout = Workout.objects.create(
            name='Morning Run',
            description='Easy 5K run to start the day',
            suggested_for='Beginner',
        )
        self.activity = Activity.objects.create(
            user=self.user,
            type='Running',
            duration=35,
            date='2026-04-29',
        )
        self.leaderboard_entry = Leaderboard.objects.create(user=self.user, score=900)

    def test_api_root_returns_endpoints(self):
        response = self.client.get(reverse('api-root'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)
        self.assertIn('teams', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('workouts', response.data)
        self.assertIn('leaderboard', response.data)

    def test_create_team(self):
        response = self.client.post(
            reverse('team-list'), {'name': 'Team Beta'}, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Team.objects.filter(name='Team Beta').count(), 1)

    def test_create_user_with_team(self):
        response = self.client.post(
            reverse('user-list'),
            {'name': 'John Smith', 'email': 'john@example.com', 'team_id': self.team.id},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.filter(email='john@example.com').count(), 1)

    def test_list_activities(self):
        response = self.client.get(reverse('activity-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_leaderboard_order(self):
        response = self.client.get(reverse('leaderboard-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['score'], self.leaderboard_entry.score)
