FROM python:3.9-slim

# Set working directory
WORKDIR /usr/src/app

# Install MySQL client and clean up cache
RUN apt-get update && \
    apt-get install -y default-mysql-client && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy rest of the project files
COPY updatetables.py wait-for-it.sh ./  
COPY data/DMP_v2.xlsx ./data/

# Make wait-for-it executable
RUN chmod +x wait-for-it.sh

# Set default command
CMD ["python3"]
