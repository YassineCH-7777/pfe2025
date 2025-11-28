import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam
import random
from collections import deque
import logging

logging.basicConfig(level=logging.INFO)

class DQNTrainer:
    def __init__(self):
        self.state_size = 100
        self.action_size = 10
        self.memory = deque(maxlen=2000)
        self.gamma = 0.95
        self.epsilon = 1.0
        self.epsilon_min = 0.01
        self.epsilon_decay = 0.995
        self.learning_rate = 0.001
        self.model = self._build_model()

    def _build_model(self):
        model = Sequential([
            Dense(64, input_dim=self.state_size, activation='relu'),
            Dropout(0.1),
            Dense(64, activation='relu'),
            Dropout(0.1),
            Dense(32, activation='relu'),
            Dense(1, activation='linear')
        ])
        model.compile(loss='mse', optimizer=Adam(learning_rate=self.learning_rate))
        return model

    def train(self, episodes=1000):
        for episode in range(episodes):
            state = self._generate_state()
            done = False
            total_reward = 0

            while not done:
                if random.random() <= self.epsilon:
                    action_value = random.random()
                else:
                    action_value = self.model.predict(np.expand_dims(state, axis=0))[0][0]

                next_state, reward, done = self._simulate_step(state, action_value)
                self.memory.append((state, action_value, reward, next_state, done))
                state = next_state
                total_reward += reward

                if len(self.memory) > 32:
                    self._replay(32)

            if self.epsilon > self.epsilon_min:
                self.epsilon *= self.epsilon_decay

            if episode % 100 == 0:
                logging.info(f"Episode: {episode}, Total Reward: {total_reward}, Epsilon: {self.epsilon}")

        self.model.save('dqn_trained_model.h5')

    def _generate_state(self):
        """Generate a valid state for the DQN model."""
        state = {
            "main_panel": {
                "width": random.uniform(0.5, 2.0),
                "height": random.uniform(0.5, 2.0)
            },
            "additional_panels": [],
            "existing_cuts": []
        }

        # Add additional panels
        for _ in range(24):
            if random.random() < 0.7:
                panel = {
                    "width": random.uniform(0.1, 0.5),
                    "height": random.uniform(0.1, 0.5),
                    "quantity": random.randint(1, 5) / 10
                }
                if panel["width"] <= state["main_panel"]["width"] and panel["height"] <= state["main_panel"]["height"]:
                    state["additional_panels"].append(panel)

        # Add existing cuts
        for _ in range(8):
            if random.random() < 0.3:
                cut = {
                    "start_x": random.uniform(0, state["main_panel"]["width"]),
                    "start_y": random.uniform(0, state["main_panel"]["height"]),
                    "end_x": random.uniform(0, state["main_panel"]["width"]),
                    "end_y": random.uniform(0, state["main_panel"]["height"])
                }
                state["existing_cuts"].append(cut)

        return state

    def _simulate_step(self, state, action_value):
        """Simulate a cutting step and return the new state and reward."""
        next_state = state.copy()

        # Simulate adding a new cut based on the action value
        for i, cut in enumerate(next_state["existing_cuts"]):
            if cut["start_x"] == 0 and cut["start_y"] == 0 and cut["end_x"] == 0 and cut["end_y"] == 0:
                # Add a new cut
                start_x = random.uniform(0, next_state["main_panel"]["width"])
                start_y = random.uniform(0, next_state["main_panel"]["height"])
                end_x = random.uniform(0, next_state["main_panel"]["width"])
                end_y = random.uniform(0, next_state["main_panel"]["height"])

                # Validate: Check if the cut fits within the main panel
                if end_x <= next_state["main_panel"]["width"] and end_y <= next_state["main_panel"]["height"]:
                    next_state["existing_cuts"][i] = {
                        "start_x": start_x,
                        "start_y": start_y,
                        "end_x": end_x,
                        "end_y": end_y
                    }
                    break

        # Calculate the reward
        reward = self._calculate_reward(state, next_state, action_value)

        # Determine if the episode is terminated
        done = len(next_state["existing_cuts"]) >= 8  # Terminate if all cuts are used

        return next_state, reward, done

    def _calculate_reward(self, state, next_state, action_value):
        """Calculate the reward based on the current state, next state, and action value."""
        unused_space_before = self._calculate_unused_space(state)
        unused_space_after = self._calculate_unused_space(next_state)
        reward = unused_space_before - unused_space_after

        # Penalty for invalid cuts
        if unused_space_after < 0:
            reward -= 10

        return reward

    def _calculate_unused_space(self, state):
        """Calculate the unused space in the main panel."""
        main_panel_width = state["main_panel"]["width"]
        main_panel_height = state["main_panel"]["height"]
        total_area = main_panel_width * main_panel_height

        used_area = 0
        for panel in state["additional_panels"]:
            used_area += panel["width"] * panel["height"] * panel["quantity"]

        return total_area - used_area

    def _replay(self, batch_size):
        """Train the model on a batch of data from the memory."""
        if len(self.memory) < batch_size:
            return

        batch = random.sample(self.memory, batch_size)

        states = np.array([item[0] for item in batch])
        action_values = np.array([item[1] for item in batch])
        rewards = np.array([item[2] for item in batch])
        next_states = np.array([item[3] for item in batch])
        dones = np.array([item[4] for item in batch])

        current_q_values = self.model.predict(states)
        next_q_values = self.model.predict(next_states)

        targets = rewards + self.gamma * np.max(next_q_values, axis=1) * (1 - dones)
        current_q_values[:, 0] = targets

        self.model.fit(states, current_q_values, epochs=1, verbose=0)