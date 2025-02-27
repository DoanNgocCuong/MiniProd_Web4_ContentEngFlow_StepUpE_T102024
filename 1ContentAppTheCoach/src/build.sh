echo "🔍 Checking for processes on ports 3000 and 25007..."

# Function to kill process on a specific port
kill_process_on_port() {
    local port=$1
    # Try multiple ways to find processes
    local pids=$(
        sudo lsof -ti :$port 2>/dev/null;
        sudo fuser $port/tcp 2>/dev/null;
        sudo netstat -tlpn | grep ":$port" | awk '{print $7}' | cut -d'/' -f1
    )
    if [ ! -z "$pids" ]; then
        echo "📍 Found process(es) on port $port (PIDs: $pids)"
        for pid in $pids; do
            sudo kill -9 $pid 2>/dev/null
        done
        echo "✅ Killed process on port $port"
    else
        echo "ℹ️ No process found on port $port"
    fi
}

# Clean up any existing containers using these ports
echo "🧹 Cleaning up existing containers..."
sudo docker-compose down

# Force remove any container using port 3000
echo "🧹 Force removing containers using port 3000..."
sudo docker ps -a | grep ':3000->' | awk '{print $1}' | xargs -r sudo docker rm -f

# Kill processes on specified ports
kill_process_on_port 25007
kill_process_on_port 3000

echo "⏳ Waiting for ports to be released..."
sleep 5

# Verify ports are actually free
echo "🔍 Verifying ports are free..."
if sudo nc -z localhost 3000 2>/dev/null; then
    echo "❌ Port 3000 is still in use!"
    exit 1
fi
if sudo nc -z localhost 25007 2>/dev/null; then
    echo "❌ Port 25007 is still in use!"
    exit 1
fi
echo "✅ Ports are free"

echo "🏗️ Building Docker images..."
# Build with no-cache to ensure fresh build
sudo docker-compose build --no-cache

# Double check ports before starting
echo "🔍 Double checking ports..."
kill_process_on_port 3000
kill_process_on_port 25007

echo "🚀 Starting services..."
# Start services in detached mode
sudo docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 5

echo "📋 Checking service status..."
# Show running containers
sudo docker-compose ps

echo "📝 Showing logs..."
# Show logs
sudo docker-compose logs -f 