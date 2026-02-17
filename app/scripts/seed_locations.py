
import csv
import io
import uuid
import urllib.request
import json
import sys
import os

# CSV URL
CSV_URL = "https://docs.google.com/spreadsheets/d/1uhGBXEjwJ85ulHGVLrBB7VnIVOmyc7yD8rszOpoYWXE/export?format=csv&gid=1421960264"
OUTPUT_FILE = "supabase/migrations/20260216193000_seed_locations.sql"

def normalize_text(text):
    if not text:
        return ""
    return text.strip().upper()

def main():
    print(f"Downloading CSV from {CSV_URL}...")
    try:
        with urllib.request.urlopen(CSV_URL) as response:
            csv_content = response.read().decode('utf-8')
    except Exception as e:
        print(f"Failed to download CSV: {e}")
        return

    reader = csv.DictReader(io.StringIO(csv_content))
    
    # Data structures to store unique entities
    # Structure: { normalized_name: uuid }
    countries = {}
    states = {} # { (country_id, state_name): uuid }
    cities = [] # List of (city_name, state_id, ibge_code if available)

    # Columns based on sheet inspection (Browser Agent output)
    # Expected columns: Código, Nome, Estado, País
    
    # Process rows
    print("Processing data...")
    for row in reader:
        # Get values
        city_name = normalize_text(row.get('Nome', ''))
        state_name = normalize_text(row.get('Estado', ''))
        country_name = normalize_text(row.get('País', ''))
        code = row.get('Código', '').strip()

        if not city_name or not state_name or not country_name:
            continue

        # country
        if country_name not in countries:
            countries[country_name] = str(uuid.uuid4())
        
        country_id = countries[country_name]
        
        # state
        state_key = (country_id, state_name)
        if state_key not in states:
            states[state_key] = str(uuid.uuid4())
            
        state_id = states[state_key]
        
        # clean numeric fields (replace , with . and handle empty)
        def clean_float(val):
            if not val: return None
            return val.replace(',', '.').strip()

        lat = clean_float(row.get('Latitude', ''))
        lon = clean_float(row.get('Longitude', ''))
        
        # city
        cities.append({
            'code': code,
            'name': city_name,
            'state_id': state_id,
            'latitude': lat,
            'longitude': lon
        })

    # Generate SQL
    print(f"Generating SQL for {len(countries)} countries, {len(states)} states, {len(cities)} cities...")
    
    with open(OUTPUT_FILE, 'w') as f:
        f.write("-- Seed locations from Google Sheet\n\n")
        
        # Create Tables
        f.write("""
CREATE TABLE IF NOT EXISTS public.countries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.states (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    country_id uuid REFERENCES public.countries(id) ON DELETE CASCADE,
    UNIQUE(name, country_id)
);

CREATE TABLE IF NOT EXISTS public.cities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    state_id uuid REFERENCES public.states(id) ON DELETE CASCADE,
    ibge_code text,
    latitude numeric,
    longitude numeric,
    UNIQUE(name, state_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_states_country ON public.states(country_id);
CREATE INDEX IF NOT EXISTS idx_cities_state ON public.cities(state_id);

-- RLS
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
DROP POLICY IF EXISTS "Public read countries" ON public.countries;
CREATE POLICY "Public read countries" ON public.countries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read states" ON public.states;
CREATE POLICY "Public read states" ON public.states FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read cities" ON public.cities;
CREATE POLICY "Public read cities" ON public.cities FOR SELECT USING (true);

""")
        
        f.write("\n-- Insert Countries\n")
        f.write("INSERT INTO public.countries (id, name) VALUES\n")
        country_values = [f"('{uid}', '{name}')" for name, uid in countries.items()]
        f.write(",\n".join(country_values) + "\nON CONFLICT (name) DO NOTHING;\n")
        
        f.write("\n-- Insert States\n")
        f.write("INSERT INTO public.states (id, name, country_id) VALUES\n")
        state_values = [f"('{uid}', '{name}', '{cid}')" for (cid, name), uid in states.items()]
        f.write(",\n".join(state_values) + "\nON CONFLICT (name, country_id) DO NOTHING;\n")
        
        f.write("\n-- Insert Cities (Batched to avoid parser stack overflow)\n")
        # Split cities into batches of 1000
        batch_size = 1000
        for i in range(0, len(cities), batch_size):
            batch = cities[i:i+batch_size]
            f.write("INSERT INTO public.cities (name, state_id, ibge_code, latitude, longitude) VALUES\n")
            city_values = []
            for city in batch:
                city_name = city['name'].replace("'", "''")
                code_val = f"'{city['code']}'" if city['code'] else 'NULL'
                lat_val = str(city['latitude']) if city['latitude'] is not None else 'NULL'
                long_val = str(city['longitude']) if city['longitude'] is not None else 'NULL'
                city_values.append(f"('{city_name}', '{city['state_id']}', {code_val}, {lat_val}, {long_val})")
            
            f.write(",\n".join(city_values) + "\nON CONFLICT (name, state_id) DO UPDATE SET latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude;\n\n")

    print(f"Migration file created at {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
